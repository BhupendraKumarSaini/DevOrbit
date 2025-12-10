import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
