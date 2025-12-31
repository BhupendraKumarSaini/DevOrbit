import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import heroRoutes from "./src/routes/heroRoutes.js";
import aboutRoutes from "./src/routes/aboutRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import footerRoutes from "./src/routes/footerRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

dotenv.config();

const app = express();

/* Global middlewares */
app.use(cors());
app.use(express.json());

/* Static file serving */
app.use("/uploads", express.static("src/uploads"));
app.use("/uploads/projects", express.static("src/uploads/projects"));

/* API routes */
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/admin", adminRoutes);

/* MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

/* Server start */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
