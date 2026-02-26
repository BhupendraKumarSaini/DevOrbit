import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Bubbles from "./animation/Bubbles";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import About from "./component/About";
import Skills from "./component/Skills";
import Experience from "./component/Experience";
import Projects from "./component/Projects";
import Education from "./component/Education";
import Footer from "./component/Footer";
import AdminLogin from "./page/AdminLogin";
import AdminDashboard from "./page/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalLoader from "./component/ui/GlobalLoader";
import { apiFetch } from "./lib/api";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [
          hero,
          about,
          skills,
          experience,
          projects,
          education,
          certifications,
          footer,
        ] = await Promise.all([
          apiFetch("/api/hero"),
          apiFetch("/api/about"),
          apiFetch("/api/skills"),
          apiFetch("/api/experience"),
          apiFetch("/api/projects"),
          apiFetch("/api/education"),
          apiFetch("/api/certifications"),
          apiFetch("/api/footer"),
        ]);

        setData({
          hero,
          about,
          skills,
          experience,
          projects,
          education,
          certifications,
          footer,
        });
      } catch (e) {
        console.error("Initial load failed", e);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Normalize first public load
    if (location.pathname === "/") {
      navigate("/", { replace: true });
    }
  }, []);

  if (loading || !data) {
    return <GlobalLoader />;
  }

  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
      <Route
        path="/"
        element={
          <>
            <Bubbles />
            <Navbar footer={data.footer} />
            <Hero hero={data.hero} footer={data.footer} />
            <About about={data.about} />
            <Skills skills={data.skills} />
            <Experience experience={data.experience} />
            <Projects projects={data.projects} />
            <Education
              education={data.education}
              certifications={data.certifications}
            />
            <Footer footer={data.footer} />
          </>
        }
      />

      {/* ADMIN LOGIN */}
      <Route
        path="/admin-login"
        element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        }
      />

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
