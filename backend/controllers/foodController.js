import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import jwt from "jsonwebtoken";

// Add food items
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// List all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove food
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`, () => {});
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Submit rating only
const submitFoodRating = async (req, res) => {
  try {
    const { foodId, stars } = req.body;
    let userId = req.body.userId;
    if (!userId && req.headers.token) {
      try {
        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET || "your_jwt_secret");
        userId = decoded.id;
      } catch (error) {
        console.log("Token verification failed:", error);
      }
    }

    // Get user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Get food
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Check if user already rated
    const existingRatingIndex = food.reviews.findIndex(
      (review) => review.userId.toString() === userId.toString()
    );
    if (existingRatingIndex !== -1) {
      // Update rating
      food.reviews[existingRatingIndex].rating = stars;
      food.reviews[existingRatingIndex].date = new Date();
    } else {
      // Add new rating
      food.reviews.push({
        userId,
        userName: user.name,
        rating: stars,
        date: new Date(),
      });
    }

    // Recalculate average rating
    const totalRating = food.reviews.reduce((sum, review) => sum + review.rating, 0);
    food.rating = totalRating / food.reviews.length;
    food.reviewCount = food.reviews.length;

    await food.save();

    res.json({ success: true, message: "Rating submitted successfully", rating: food.rating, reviewCount: food.reviewCount });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error submitting rating" });
  }
};

// Get rating info only
const getFoodRating = async (req, res) => {
  try {
    const foodId = req.params.id || req.body.foodId; // support GET or POST
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }
    res.json({ success: true, avgRating: food.rating || 0, reviewCount: food.reviewCount || 0 });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching rating" });
  }
};

// Get food details
const getFoodDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food details" });
  }
};

export { addFood, listFood, removeFood, submitFoodRating, getFoodRating, getFoodDetails };
