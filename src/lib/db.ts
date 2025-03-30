import { supabase } from "./supabase";

export interface Article {
  id: string;
  content: string;
  timestamp: string;
}

export async function insertArticle(article: Article) {
  const { data, error } = await supabase
    .from("articles")
    .insert([article])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getArticles(page: number = 1, limit: number = 10) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("timestamp", { ascending: false })
    .range(start, end);

  if (error) {
    throw error;
  }

  return data;
}

export async function getLatestArticle() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
