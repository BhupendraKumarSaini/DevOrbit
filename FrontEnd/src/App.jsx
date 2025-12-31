import React from "react";
import { Routes, Route } from "react-router-dom";

import Bubbles from "./animation/Bubbles";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import About from "./component/About";
import Skills from "./component/Skills";
import Projects from "./component/Projects";
import Footer from "./component/Footer";

import AdminLogin from "./page/AdminLogin";
import AdminDashboard from "./page/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
      <Route
        path="/"
        element={
          <>
            <Bubbles />
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Footer />
          </>
        }
      />

      {/* ADMIN LOGIN */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* PROTECTED ADMIN DASHBOARD */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
