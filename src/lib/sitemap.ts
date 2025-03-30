import { getArticles } from "./db";

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  const articles = await getArticles(1, 100); // Get up to 100 latest articles

  const entries: SitemapEntry[] = [
    {
      url: baseUrl,
      changefreq: "daily",
      priority: 1.0,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/article/${article.id}`,
      lastmod: article.timestamp,
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ""}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ""}
  </url>`,
    )
    .join("")}
</urlset>`;

  return sitemap;
}
