import { Schema, model } from "mongoose";

const wishlistItemSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

wishlistItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

wishlistItemSchema.set("toJSON", { virtuals: true });

export const WishlistItem = model("WishlistItem", wishlistItemSchema); 