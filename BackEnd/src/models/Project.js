import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    points: { type: [String], required: true },
    techStack: { type: [String], required: true },
    liveLink: { type: String },
    githubLink: { type: String },
    thumbnail: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
