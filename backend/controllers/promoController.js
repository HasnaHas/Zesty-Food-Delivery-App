import promoModel from "../models/Promo.js";
import jwt from 'jsonwebtoken';

// Add promo or coupon
const addPromo = async (req, res) => {
  try {
    const promo = new promoModel(req.body);
    await promo.save();
    res.json({ success: true, message: "Promo added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding promo" });
  }
};

// Remove promo or coupon
const removePromo = async (req, res) => {
  try {
    await promoModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Promo removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing promo" });
  }
};

// List all promos and coupons
const listAll = async (req, res) => {
  try {
    const promos = await promoModel.find({});
    res.json({ success: true, data: promos });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching promos" });
  }
};

// Apply promo code
const applyPromo = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    // Extract userId from JWT token in headers
    const token = req.headers.token;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        userId = decoded.id;
      } catch (error) {
        console.log('Token verification failed:', error);
      }
    }

    const promo = await promoModel.findOne({ code: code.toUpperCase(), active: true });

    if (!promo) {
      return res.json({ success: false, message: "Invalid promo code" });
    }

    // Check expiry
    if (new Date() > promo.expiry) {
      return res.json({ success: false, message: "Promo code expired" });
    }

    // Check usage limit
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.json({ success: false, message: "Promo code usage limit reached" });
    }

    // Check min order value
    if (orderAmount < promo.minOrderValue) {
      return res.json({ success: false, message: `Minimum order value is $${promo.minOrderValue}` });
    }

    // Check eligibility (for new users, check if user has any previous orders)
    if (promo.eligibilityType === 'new_users') {
      const orderModel = (await import("../models/orderModel.js")).default;
      const previousOrders = await orderModel.find({ userId });
      if (previousOrders.length > 0) {
        return res.json({ success: false, message: "Promo code is for new users only" });
      }
    }

    // Calculate discount
    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (orderAmount * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    discount = Math.min(discount, orderAmount);

    res.json({
      success: true,
      discount,
      promo: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error applying promo" });
  }
};

export { addPromo, removePromo, listAll, applyPromo };
