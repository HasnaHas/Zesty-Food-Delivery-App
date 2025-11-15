import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  foodId: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now() },
});

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
