import { NewsContent } from "@/components/NewsContent";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold">UTF</h1>
      <NewsContent />
    </main>
  );
}
