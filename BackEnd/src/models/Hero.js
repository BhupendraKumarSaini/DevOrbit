import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    headline: { type: String, required: true },
    profileImage: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Hero", heroSchema);
