import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['promo', 'coupon'], required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expiry: { type: Date, required: true },
  usageLimit: { type: Number, default: null }, // null means unlimited
  usedCount: { type: Number, default: 0 },
  eligibilityType: { type: String, enum: ['all', 'new_users'], default: 'all' },
  minOrderValue: { type: Number, default: 0 },
  description: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const promoModel = mongoose.models.promo || mongoose.model("promo", promoSchema);

export default promoModel;
