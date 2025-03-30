import { ArticleCard } from "@/components/ArticleCard";
import { Layout } from "@/components/Layout";
import { getArticle } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(id);

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
