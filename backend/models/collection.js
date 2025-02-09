import { Schema, model } from "mongoose";

const categorySchema = Schema(
  {
    name: { type: String, required: true },
    icon: { type: String },
    color: { type: String },
    image: { type: String, default: "" },
  },
  { suppressReservedKeysWarning: true }
);
export const Category = model("Category", categorySchema);
