import { Schema, model } from "mongoose";

const orderItemSchema = Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

export const OrderItem = model("OrderItem", orderItemSchema);
