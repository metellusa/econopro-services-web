import { Routes, Route, Navigate } from "react-router-dom";
import SiteShell from "./components/SiteShell";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import Gallery from "./pages/Gallery";
import Faq from "./pages/Faq";
import FinancingOptions from "./pages/FinancingOptions";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";

export default function App() {
  return (
    <SiteShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/financing-options" element={<FinancingOptions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  );
}
