const SITE_URL = "https://econoproservices.com";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/kitchen-finished-1.webp`;

export const PAGE_META = {
  "/": {
    title:
      "EconoPro Services | Flooring, Painting, Drywall & Cleaning in Orlando and Tampa, FL",
    description:
      "Reliable home improvement and cleaning services in Orlando and Tampa. Flooring, drywall, painting, cleaning, and property maintenance with clear communication.",
  },
  "/services": {
    title: "Home Improvement & Cleaning Services | EconoPro Services Orlando & Tampa",
    description:
      "Explore flooring, drywall, painting, cleaning, property maintenance, and design assistance from EconoPro Services in Orlando and Tampa, FL.",
  },
  "/bookings": {
    title: "Request an Estimate or Cleaning | EconoPro Services",
    description:
      "Request a home improvement estimate or cleaning appointment online. Serving Orlando and Tampa, FL.",
  },
  "/financing-options": {
    title: "Financing Options for Home Projects | EconoPro Services",
    description:
      "Explore flexible payment options for qualifying home improvement projects with EconoPro Services in Orlando and Tampa.",
  },
  "/projects": {
    title: "Completed Projects | EconoPro Services Orlando & Tampa",
    description:
      "See real EconoPro project photography including kitchen renovations, flooring, painting, exterior work, and cleaning.",
  },
  "/about": {
    title: "About EconoPro Services | Local Home Improvement in Orlando & Tampa",
    description:
      "Learn about EconoPro Services — a local home improvement and cleaning company serving Orlando and Tampa, FL.",
  },
  "/reviews": {
    title: "Customer Reviews | EconoPro Services",
    description:
      "Read real customer feedback about EconoPro Services and view our BBB Accredited Business profile.",
  },
  "/faq": {
    title: "FAQ | EconoPro Services Orlando & Tampa",
    description:
      "Answers about booking, estimates, cleaning services, hours, financing, and service areas for EconoPro Services.",
  },
  "/contact": {
    title: "Contact EconoPro Services | Orlando & Tampa",
    description:
      "Contact EconoPro Services by phone or email, or request an estimate online. Serving Orlando and Tampa, FL.",
  },
  "/thank-you": {
    title: "Request Received | EconoPro Services",
    description: "Your request was submitted successfully. EconoPro Services will follow up shortly.",
    noindex: true,
  },
};

export function buildCanonical(pathname) {
  if (!pathname || pathname === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${pathname.replace(/\/$/, "")}`;
}

export function getServiceMeta(service) {
  if (!service) return null;
  return {
    title: `${service.shortTitle} in Orlando & Tampa | EconoPro Services`,
    description: service.summary,
  };
}

export function getProjectMeta(project) {
  if (!project) return null;
  return {
    title: `${project.title} | EconoPro Projects`,
    description: project.summary,
  };
}

export { SITE_URL };
