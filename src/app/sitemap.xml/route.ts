import { NextResponse } from "next/server";
import { generateSitemap } from "@/lib/sitemap";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://universalfriscotx.com";
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
