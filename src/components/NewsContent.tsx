"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Article } from "@/lib/db";
import { ArticleCard } from "./ArticleCard";
import { Button } from "./Button";
import { Loader2 } from "lucide-react";
import { getArticles } from "@/lib/db";

export function NewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch saved articles from the database
  const fetchSavedArticles = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles(pageNum);
      // Convert timestamps to Date objects
      const articlesWithDates = data.map((article) => ({
        ...article,
        timestamp: new Date(article.timestamp),
      }));

      if (pageNum === 1) {
        setArticles(articlesWithDates);
      } else {
        setArticles((prev) => [...prev, ...articlesWithDates]);
      }
      setHasMore(data.length === 10); // Assuming 10 items per page
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Generate a new article
  const generateNewArticle = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-content");
      if (!response.ok) {
        throw new Error("Failed to generate article");
      }
      const data = await response.json();
      // Convert timestamp to Date object for new article
      const articleWithDate = {
        ...data,
        timestamp: new Date(data.timestamp),
      };
      setArticles([articleWithDate, ...articles]);
    } catch (err) {
      console.error("Error generating article:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  // Load more articles when the user scrolls to the bottom
  const lastArticleRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    fetchSavedArticles(page);
  }, [page]);

  if (error) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500">Error: {error}</p>
        <Button
          onClick={() => fetchSavedArticles(1)}
          disabled={loading}
          loading={loading}
        >
          {loading ? "Fetching..." : "Try again"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={generateNewArticle}
          disabled={generating}
          loading={generating}
        >
          {generating ? "Generating..." : "Generate New Article"}
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <div>
          {loading ? (
            <div className="my-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !loading && articles.length === 0 ? (
            <div className="my-10">
              <p>No articles yet...</p>
            </div>
          ) : (
            articles.map((article, index) => (
              <div
                key={article.id}
                ref={index === articles.length - 1 ? lastArticleRef : undefined}
              >
                <ArticleCard article={article} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
