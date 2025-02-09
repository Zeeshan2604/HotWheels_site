import { Schema, model } from "mongoose";

const favProductSchema = Schema({
  name: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", requied: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  dateCreated: { type: Date, default: Date.now },
});

favProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

favProductSchema.set("toJSON", { virtuals: true });

export const favProdSchema = model("favProductSchema", favProductSchema);
