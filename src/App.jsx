import { Routes, Route, Navigate } from "react-router-dom";
import SiteShell from "./components/SiteShell";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Bookings from "./pages/Bookings";
import Gallery from "./pages/Gallery";
import Faq from "./pages/Faq";
import FinancingOptions from "./pages/FinancingOptions";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import About from "./pages/About";
import Reviews from "./pages/Reviews";

export default function App() {
  return (
    <SiteShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/financing-options" element={<FinancingOptions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/projects" element={<Navigate to="/gallery" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  );
}
