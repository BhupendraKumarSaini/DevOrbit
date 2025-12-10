// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import Admin from "./src/models/adminModel.js";

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://devorbit:asdfghyu14314366@cluster0.rr1mxi4.mongodb.net/devorbit?retryWrites=true&w=majority")
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// async function createAdmin() {
//   try {
//     const hashed = await bcrypt.hash("asdfghyu14314366", 10);

//     await Admin.create({
//       email: "bhupendra.saini.dev@gmail.com",
//       password: hashed,
//     });

//     console.log("✔ Admin created successfully!");
//   } catch (err) {
//     console.log("❌ Error creating admin:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// createAdmin();
