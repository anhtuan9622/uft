import { supabase } from "./supabase";
import { generateSitemap } from "./sitemap";
import { baseUrl } from "./constant";

export interface Article {
  id: string;
  content: string;
  timestamp: string;
}

export async function insertArticle(article: Article) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .insert([article])
      .select()
      .single();

    if (error) {
      console.error("Error inserting article:", error);
      throw error;
    }

    // Generate new sitemap after article insertion
    try {
      await generateSitemap(baseUrl);
    } catch (error) {
      console.error("Error generating sitemap after article insertion:", error);
      // Don't throw the error as sitemap generation is not critical for article creation
    }

    return data;
  } catch (error) {
    console.error("Error in insertArticle:", error);
    throw error;
  }
}

export async function getArticles(page: number = 1, limit: number = 10) {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("timestamp", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching articles:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error in getArticles:", error);
    return [];
  }
}

export async function getLatestArticle() {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching latest article:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getLatestArticle:", error);
    return null;
  }
}

export async function getArticle(id: string) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getArticle:", error);
    return null;
  }
}
