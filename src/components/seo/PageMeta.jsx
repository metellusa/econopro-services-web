import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  PAGE_META,
  DEFAULT_OG_IMAGE,
  buildCanonical,
  getServiceMeta,
  getProjectMeta,
} from "../../data/seo";
import { getServiceBySlug } from "../../data/services";
import { getProjectBySlug } from "../../data/projects";

function upsertMeta(selector, attribute, attributeValue, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    let meta = PAGE_META[pathname];

    if (!meta && pathname.startsWith("/services/")) {
      const slug = pathname.split("/")[2];
      meta = getServiceMeta(getServiceBySlug(slug));
    }

    if (!meta && pathname.startsWith("/projects/")) {
      const slug = pathname.split("/")[2];
      meta = getProjectMeta(getProjectBySlug(slug));
    }

    if (!meta) {
      meta = PAGE_META["/"];
    }

    const title = meta.title;
    const description = meta.description;
    const canonical = buildCanonical(pathname);
    const robots = meta.noindex ? "noindex, nofollow" : "index, follow";

    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[name="robots"]', "name", "robots", robots);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[property="og:image"]', "property", "og:image", DEFAULT_OG_IMAGE);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", DEFAULT_OG_IMAGE);
    upsertLink("canonical", canonical);
  }, [pathname]);

  return null;
}
