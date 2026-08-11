export const PROJECTS = [
  {
    slug: "kitchen-renovation",
    title: "Kitchen Renovation Transformation",
    category: "Renovation",
    summary:
      "A full kitchen transformation from the original space through demolition, prep, installation, and the finished result.",
    heroImage: "/kitchen-finished-1.jpeg",
    relatedServiceSlug: "flooring",
    relatedServiceLabel: "Flooring & Home Improvement",
    scope: [
      "Kitchen demolition and prep",
      "Layout updates and installation",
      "Finishing and final clean-up presentation",
    ],
    progression: [
      {
        label: "Original",
        image: "/original-kitchen.jpeg",
        caption: "Original kitchen before renovation.",
      },
      {
        label: "Demolition",
        image: "/kitchen-demo-1.jpeg",
        caption: "Demolition opened the space for the new layout.",
      },
      {
        label: "Prep",
        image: "/kitchen-demo-2.jpeg",
        caption: "Structural and prep work set the stage for build-out.",
      },
      {
        label: "Installation",
        image: "/kitchen-finished-1.jpeg",
        caption: "New layout, cabinetry, and finishes taking shape.",
      },
      {
        label: "Finishing",
        image: "/kitchen-progress-2.jpeg",
        caption: "Finishing details refined the completed look.",
      },
      {
        label: "Completed",
        image: "/kitchen-finished-2.jpeg",
        caption: "Finished kitchen from the opposite living view.",
      },
    ],
    gallery: [
      "/original-kitchen.jpeg",
      "/kitchen-demo-1.jpeg",
      "/kitchen-demo-2.jpeg",
      "/kitchen-finished-1.jpeg",
      "/kitchen-progress-2.jpeg",
      "/kitchen-finished-2.jpeg",
    ],
  },
  {
    slug: "custom-foyer-flooring",
    title: "Custom Foyer Flooring Design",
    category: "Flooring",
    summary:
      "Decorative tile and wood-look flooring installation with a bold custom pattern.",
    heroImage: "/after-foyer-pic.jpg",
    relatedServiceSlug: "flooring",
    relatedServiceLabel: "Flooring",
    scope: ["Custom flooring pattern", "Tile and wood-look installation"],
    gallery: ["/after-foyer-pic.jpg"],
  },
  {
    slug: "kitchen-tile-flooring",
    title: "Kitchen Tile Flooring Installation",
    category: "Flooring",
    summary:
      "Warm wood-look tile flooring installed for a clean, modern kitchen finish.",
    heroImage: "/after-kitchen-tile installation.png",
    relatedServiceSlug: "flooring",
    relatedServiceLabel: "Flooring",
    scope: ["Kitchen tile flooring installation"],
    gallery: ["/after-kitchen-tile installation.png"],
  },
  {
    slug: "interior-painting",
    title: "Interior Painting Project",
    category: "Painting",
    summary:
      "Fresh interior wall painting that brightened the room and refreshed the space.",
    heroImage: "/after-room-painted.png",
    relatedServiceSlug: "painting",
    relatedServiceLabel: "Painting",
    scope: ["Interior wall painting"],
    gallery: ["/after-room-painted.png"],
  },
  {
    slug: "exterior-composite-panels",
    title: "Exterior Composite Panel Installation",
    category: "Exterior",
    summary:
      "Modern exterior upgrade with composite panel installation for a sleek, durable finish.",
    heroImage: "/composite-panel-installation-after-1.png",
    relatedServiceSlug: "property-maintenance",
    relatedServiceLabel: "Property Maintenance",
    scope: ["Exterior composite panel installation"],
    gallery: [
      "/composite-panel-installation-after-1.png",
      "/composite-panel-installation-after-2.png",
    ],
  },
  {
    slug: "move-out-deep-cleaning",
    title: "Move-Out Deep Cleaning",
    category: "Cleaning",
    summary:
      "Detail-oriented deep cleaning for a thoroughly refreshed home.",
    heroImage: "/deep-cleaning.jpeg",
    relatedServiceSlug: "cleaning",
    relatedServiceLabel: "Cleaning",
    scope: ["Move-out deep cleaning"],
    gallery: ["/deep-cleaning.jpeg"],
  },
];

export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug) || null;
}

export function getProjectCategories() {
  return [...new Set(PROJECTS.map((project) => project.category))];
}

export function getProjectPath(slug) {
  return `/projects/${slug}`;
}
