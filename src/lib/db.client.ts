import { supabase } from "./supabaseClient";
import type { Article } from "./types";

export async function getArticles(
  page: number = 1,
  limit: number = 10,
): Promise<Article[]> {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("timestamp", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("Error fetching articles (client):", error);
      return [];
    }

    return (data as Article[]) ?? [];
  } catch (error) {
    console.error("Error in getArticles (client):", error);
    return [];
  }
}
