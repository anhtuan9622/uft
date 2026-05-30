import { NextResponse } from "next/server";
import { generateSitemap } from "@/lib/sitemap";
import { baseUrl } from "@/lib/constant";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sitemap = await generateSitemap(baseUrl);

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 },
    );
  }
}
