import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SiteShell from "./components/SiteShell";
import PageMeta from "./components/seo/PageMeta";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PortalShell from "./components/portal/PortalShell";
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
import SignIn from "./pages/auth/SignIn";
import ResetPassword from "./pages/auth/ResetPassword";
import UpdatePassword from "./pages/auth/UpdatePassword";
import ProjectAccess from "./pages/ProjectAccess";
import AdminHome from "./pages/portals/AdminHome";
import AdminProjects from "./pages/portals/AdminProjects";
import AdminProjectForm from "./pages/portals/AdminProjectForm";
import AdminProjectDetail from "./pages/portals/AdminProjectDetail";
import AdminTemplates from "./pages/portals/AdminTemplates";
import ContractorHome from "./pages/portals/ContractorHome";
import ClientHome from "./pages/portals/ClientHome";
import { APP_ROLES, STAFF_ROLES } from "./lib/roles";

function MarketingLayout() {
  return (
    <SiteShell>
      <PageMeta />
      <Outlet />
    </SiteShell>
  );
}

const adminNav = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/templates", label: "Templates" },
];

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
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
      </Route>

      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/project-access/:token" element={<ProjectAccess />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowRoles={[...STAFF_ROLES]}>
            <PortalShell
              title="EconoPro Admin"
              accent="Staff Portal"
              navItems={adminNav}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<AdminProjectForm />} />
        <Route path="projects/:projectId" element={<AdminProjectDetail />} />
        <Route path="projects/:projectId/edit" element={<AdminProjectForm />} />
        <Route path="templates" element={<AdminTemplates />} />
      </Route>

      <Route
        path="/contractor"
        element={
          <ProtectedRoute allowRoles={[APP_ROLES.CONTRACTOR]}>
            <PortalShell
              title="EconoPro Contractor"
              accent="Field Portal"
              navItems={[{ to: "/contractor", label: "Overview", end: true }]}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<ContractorHome />} />
      </Route>

      <Route
        path="/client"
        element={
          <ProtectedRoute allowRoles={[APP_ROLES.CLIENT]}>
            <PortalShell
              title="EconoPro Client"
              accent="Client Portal"
              navItems={[{ to: "/client", label: "Overview", end: true }]}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientHome />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
