import { ArticleCard } from "@/components/ArticleCard";
import { Layout } from "@/components/Layout";
import { getArticle } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowLeft } from "lucide-react";

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <Layout>
      <div className="flex justify-end">
        <Link href="/">
          <Button icon={<ArrowLeft className="h-4 w-4" />}>Back to Home</Button>
        </Link>
      </div>
      <ArticleCard article={article} />
    </Layout>
  );
}
