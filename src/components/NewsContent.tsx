"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { Button } from "./Button";
import { Loader2, WandSparkles } from "lucide-react";
import { getArticles } from "../lib/db.client";

export function NewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch saved articles from the database (stable callback)
  const fetchSavedArticles = useCallback(async (pageNum: number = 1) => {
    // preserve scroll position when loading more by anchoring to the last visible article
    let prevAnchorId: string | null = null;
    let prevAnchorTop: number | null = null;
    if (pageNum === 1) setLoading(true);
    else {
      setLoadingMore(true);
      if (typeof document !== "undefined") {
        const els = Array.from(document.querySelectorAll("[data-article-id]"));
        const lastEl = els[els.length - 1] as Element | undefined;
        if (lastEl) {
          prevAnchorId = lastEl.getAttribute("data-article-id");
          prevAnchorTop = lastEl.getBoundingClientRect().top;
        }
      }
    }
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
      if (pageNum === 1) setLoading(false);
      else {
        setLoadingMore(false);
        // after appending, anchor viewport to the previous last article so view doesn't jump
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (prevAnchorId && prevAnchorTop != null) {
              const newEl = document.querySelector(
                `[data-article-id="${prevAnchorId}"]`,
              );
              if (newEl) {
                const newTop = (newEl as Element).getBoundingClientRect().top;
                const delta = newTop - prevAnchorTop;
                if (typeof window !== "undefined") {
                  window.scrollBy(0, delta);
                }
              }
            }
          });
        });
      }
    }
  }, []);

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
      setArticles((prev) => [articleWithDate, ...prev]);
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
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      // use threshold to avoid immediate triggers when element barely enters view
      observer.current = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (e.isIntersecting && e.intersectionRatio > 0.5 && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { root: null, rootMargin: "0px", threshold: 0.5 },
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadingMore],
  );

  useEffect(() => {
    fetchSavedArticles(page);
  }, [page, fetchSavedArticles]);

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
          icon={<WandSparkles className="h-4 w-4" />}
        >
          {generating ? "Generating..." : "Generate New Article"}
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <div ref={containerRef}>
          {loading && articles.length === 0 ? (
            <div className="my-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="my-10">
              <p>No articles yet...</p>
            </div>
          ) : (
            articles.map((article, index) => (
              <div
                key={article.id}
                data-article-id={article.id}
                ref={index === articles.length - 1 ? lastArticleRef : undefined}
              >
                <ArticleCard article={article} />
              </div>
            ))
          )}
          {loadingMore && (
            <div className="my-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
