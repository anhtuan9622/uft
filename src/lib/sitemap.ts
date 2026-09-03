import { supabaseAdmin } from "./supabaseAdmin";
import type { Article } from "./types";

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
  // Get up to 100 latest articles using the server admin client
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .order("timestamp", { ascending: false })
    .range(0, 99);

  if (error) {
    console.error("Error fetching articles for sitemap:", error);
    return "";
  }

  const articles: Article[] = (data as Article[]) ?? [];

  const entries: SitemapEntry[] = [
    {
      url: baseUrl,
      changefreq: "daily",
      priority: 1.0,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/article/${article.id}`,
      lastmod:
        typeof article.timestamp === "string"
          ? article.timestamp
          : article.timestamp.toISOString(),
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
