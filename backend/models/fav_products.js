import { Schema, model } from "mongoose";

const favProductSchema = Schema({
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
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  addedAt: { type: Date, default: Date.now },
  notes: { type: String }, // Optional notes field
}, { timestamps: true });

favProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

favProductSchema.set("toJSON", { virtuals: true });

export const favProdSchema = model("favProductSchema", favProductSchema);
