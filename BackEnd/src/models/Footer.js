import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    github: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Footer", footerSchema);
