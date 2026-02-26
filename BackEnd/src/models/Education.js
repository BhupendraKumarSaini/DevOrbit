import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institute: { type: String, required: true },
    location: { type: String },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Education", educationSchema);
