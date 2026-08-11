import { Routes, Route, Navigate } from "react-router-dom";
import SiteShell from "./components/SiteShell";
import PageMeta from "./components/seo/PageMeta";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Bookings from "./pages/Bookings";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Faq from "./pages/Faq";
import FinancingOptions from "./pages/FinancingOptions";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import About from "./pages/About";
import Reviews from "./pages/Reviews";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

export default function App() {
  return (
    <SiteShell>
      <PageMeta />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/financing-options" element={<FinancingOptions />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/gallery" element={<Navigate to="/projects" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  );
}
