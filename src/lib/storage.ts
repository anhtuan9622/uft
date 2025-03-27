import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize news file if it doesn't exist
if (!fs.existsSync(NEWS_FILE)) {
  fs.writeFileSync(NEWS_FILE, JSON.stringify([]));
}

export interface NewsItem {
  id: string;
  content: string;
  timestamp: string;
}

export function saveNews(content: string): NewsItem {
  const newsItem: NewsItem = {
    id: Date.now().toString(),
    content,
    timestamp: new Date().toISOString(),
  };

  const news = JSON.parse(fs.readFileSync(NEWS_FILE, "utf-8"));
  news.unshift(newsItem); // Add to beginning of array
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));

  return newsItem;
}

export function getAllNews(): NewsItem[] {
  return JSON.parse(fs.readFileSync(NEWS_FILE, "utf-8"));
}
