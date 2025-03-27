"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsItem } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export function NewsContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const fetchSavedNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateNewArticle = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-content");
      if (!response.ok) {
        throw new Error("Failed to generate news");
      }
      const data = await response.json();
      setNews([data, ...news]); // Add new article to the beginning of the list
    } catch (err) {
      console.error("Error generating news:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchSavedNews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-6">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={fetchSavedNews} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={generateNewArticle}
          variant="outline"
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate New Article"}
        </Button>
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">No articles available</p>
            <Button onClick={generateNewArticle} variant="outline">
              Generate First Article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {news.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>
                  {new Date(article.timestamp).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
              </CardContent>
              <hr />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
