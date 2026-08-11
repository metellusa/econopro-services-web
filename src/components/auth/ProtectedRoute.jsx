import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PortalMessage from "../portal/PortalMessage";

export default function ProtectedRoute({
  children,
  allowRoles = [],
  redirectTo = "/sign-in",
}) {
  const { loading, configured, configError, session, profile, role } = useAuth();
  const location = useLocation();

  if (!configured) {
    return (
      <PortalMessage
        title="Backend not configured"
        description={configError}
      />
    );
  }

  if (loading) {
    return (
      <PortalMessage title="Loading…" description="Checking your session." />
    );
  }

  if (!session) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!profile || profile.status === "disabled") {
    return (
      <PortalMessage
        title="Account unavailable"
        description="Your profile is missing or disabled. Contact EconoPro staff for help."
      />
    );
  }

  if (allowRoles.length > 0 && !allowRoles.includes(role)) {
    return (
      <PortalMessage
        title="Access denied"
        description="This area is limited to a different role. If you believe this is a mistake, contact EconoPro staff."
        actionLabel="Go to your portal"
        actionTo={
          role === "contractor"
            ? "/contractor"
            : role === "client"
              ? "/client"
              : role === "admin" || role === "staff"
                ? "/admin"
                : "/sign-in"
        }
      />
    );
  }

  return children;
}
