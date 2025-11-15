import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Food from "../models/foodModel.js";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper to verify token
const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    return decoded.id;
  } catch (error) {
    console.log("JWT verification failed:", error);
    return null;
  }
};

// Place order
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    let { amount, discount = 0, items, address, promoCode, userId } = req.body;
    let deliveryFee = amount > 2000 ? 0 : 2;

    if (!userId && req.headers.token) userId = getUserIdFromToken(req.headers.token);
    const totalAmount = amount + deliveryFee - discount;

    const newOrder = new orderModel({
      userId,
      items,
      amount: totalAmount,
      address,
      promoCode,
      discount,
      payment: false,
    });
    await newOrder.save();

    const line_items = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Delivery Charges" },
          unit_amount: deliveryFee * 100,
        },
        quantity: 1,
      });
    }

    const discounts = [];
    if (discount > 0) {
      const discountAmount = Math.round(discount * 100);
      if (discountAmount > 0) {
        const coupon = await stripe.coupons.create({
          amount_off: discountAmount,
          currency: "usd",
          duration: "once",
        });
        discounts.push({ coupon: coupon.id });
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      discounts,
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      metadata: { orderId: newOrder._id.toString(), userId, promoCode, discount },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Place order error:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// Verify payment
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);
      if (order?.promoCode) {
        const promoModel = (await import("../models/Promo.js")).default;
        await promoModel.findOneAndUpdate({ code: order.promoCode }, { $inc: { usedCount: 1 } });
      }
      if (order?.userId) await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      return res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error("Verify order error:", error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

// Get user orders
const userOrders = async (req, res) => {
  try {
    let { userId } = req.body;
    if (!userId && req.headers.token) userId = getUserIdFromToken(req.headers.token);
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("User orders error:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// Admin: list all orders
const listOrders = async (req, res) => {
  try {
    let userId = req.body.userId;
    if (!userId && req.headers.token) userId = getUserIdFromToken(req.headers.token);
    const user = await userModel.findById(userId);
    if (user?.role !== "admin") return res.json({ success: false, message: "You are not admin" });
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("List orders error:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    let userId = req.body.userId;
    if (!userId && req.headers.token) userId = getUserIdFromToken(req.headers.token);
    const user = await userModel.findById(userId);
    if (user?.role !== "admin") return res.json({ success: false, message: "You are not admin" });
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated Successfully" });
  } catch (error) {
    console.error("Update status error:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};

// Submit review
const submitReview = async (req, res) => {
  try {
    const { orderId, stars } = req.body;
    let userId;
    if (req.headers.token) userId = getUserIdFromToken(req.headers.token);

    const order = await orderModel.findById(orderId);
    if (!order || order.userId.toString() !== userId.toString()) {
      return res.status(400).json({ success: false, message: "Order not found or unauthorized" });
    }

    if (order.reviewed) return res.status(400).json({ success: false, message: "Order already reviewed" });

    // Update food ratings
    for (let item of order.items) {
      const food = await Food.findById(item._id);
      if (food) {
        food.reviews.push({ userId, userName: "Anonymous", rating: stars });
        const totalRating = food.reviews.reduce((sum, r) => sum + r.rating, 0);
        food.rating = totalRating / food.reviews.length;
        food.reviewCount = food.reviews.length;
        await food.save();
      }
    }

    order.reviewed = true;
    await order.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Submit review error:", error);
    res.json({ success: false, message: "Error submitting review" });
  }
};

// Delete order (admin)
const deleteOrder = async (req, res) => {
  try {
    let userId = req.body.userId;
    if (!userId && req.headers.token) userId = getUserIdFromToken(req.headers.token);
    const user = await userModel.findById(userId);
    if (user?.role !== "admin") return res.json({ success: false, message: "You are not admin" });
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.json({ success: false, message: "Error deleting order" });
  }
};

// User deletes own order
const userDeleteOrder = async (req, res) => {
  try {
    let userId = req.body.userId;
    if (!userId && req.headers.token) userId = getUserIdFromToken(req.headers.token);
    const order = await orderModel.findById(req.body.orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });
    if (order.userId.toString() !== userId.toString()) return res.json({ success: false, message: "Unauthorized" });
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("User delete order error:", error);
    res.json({ success: false, message: "Error deleting order" });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  submitReview,
  deleteOrder,
  userDeleteOrder
};
