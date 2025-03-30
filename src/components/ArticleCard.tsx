import { NewsItem } from "@/lib/storage";
import ReactMarkdown from "react-markdown";

interface ArticleCardProps {
  article: NewsItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="my-8 flex flex-col gap-4 rounded-lg border-2 border-black bg-neutral-50 p-4">
      <time className="text-xs text-neutral-500">
        {new Date(article.timestamp).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
      <div>
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
