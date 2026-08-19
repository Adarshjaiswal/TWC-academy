import type { MetadataRoute } from "next";

const routes = ["/", "/about", "/services", "/packages", "/brokers", "/results", "/faq", "/contact", "/preview"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `http://127.0.0.1:3000${route}`,
    lastModified: new Date()
  }));
}
