import { supabaseAdmin } from "./supabaseAdmin";
import type { Article } from "./types";

export async function insertArticle(article: Article) {
  try {
    // Use the Supabase REST endpoint with the service role key to ensure
    // Row Level Security is bypassed for server inserts.
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      throw new Error("Missing Supabase project ID or service role key");
    }

    const restUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/rest/v1/articles`;
    const resp = await fetch(restUrl, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify([article]),
    });

    const text = await resp.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error("Failed to parse REST insert response:", e, text);
      throw new Error("Failed to parse REST insert response");
    }

    if (!resp.ok) {
      console.error("REST insert error:", resp.status, text);
      const err = new Error("REST insert failed") as Error & { code: number };
      err.code = resp.status;
      throw err;
    }

    // The REST API returns an array of inserted rows when using return=representation
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Error in insertArticle:", error);
    throw error;
  }
}

export async function getLatestArticle(): Promise<Article | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching latest article:", error);
      return null;
    }

    return data as Article;
  } catch (error) {
    console.error("Error in getLatestArticle:", error);
    return null;
  }
}

export async function getArticle(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }

    return data as Article;
  } catch (error) {
    console.error("Error in getArticle:", error);
    return null;
  }
}

export async function getArticles(page: number = 1, limit: number = 10) {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("timestamp", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching articles (server):", error);
      return [] as Article[];
    }

    return (data as Article[]) ?? [];
  } catch (error) {
    console.error("Error in getArticles (server):", error);
    return [] as Article[];
  }
}
