import { Schema, model } from "mongoose";

const categorySchema = Schema(
  {
    name: { type: String, required: true },
    icon: { type: String },
    color: { type: String },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", { virtuals: true });

export const Category = model("Category", categorySchema);
