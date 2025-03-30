import { NextResponse } from "next/server";
import { insertArticle } from "@/lib/db";

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error("PERPLEXITY_API_KEY is not set");
}

export async function GET() {
  try {
    console.log("Starting content generation...");

    const prompt = `Summarize the latest global and U.S. key headlines from the past 12 hours. Includes:
    - Major U.S. news headlines (politics, economy, regulations, Fed updates, etc.)
    - Key international news (geopolitics, economic policies, global conflicts, etc.)
    - Global stock market trends (U.S. futures, Europe, Asia)
    - Commodity and currency movements (oil, gold, USD, yields, etc.)
    This article will be used for daily premarket prep for traders and investors.
`;

    console.log("Sending request to Perplexity...");
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that provides accurate and up-to-date information in a concise manner. 
              Keep the same format for the article for each response. 
              The article should be in markdown format with the following structure: # Title, ## Major U.S. News Headlines, ## Key International News, ## Global Stock Market Trends, ## Commodity and Currency Movements, ## Analysis of News Impact on the Stock Market. 
              Create a title that is short phrase humurous and engaging. Using bullet points, make sure to include the impact on the stock market for each news item and label news items as bullish or bearish.
              `,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        search_recency_filter: "day",
        web_search_options: { search_content_size: "high" },
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Perplexity API error: ${response.status} ${response.statusText} - ${responseText}`,
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Failed to parse API response: ${e}`);
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error(`Invalid API response format: ${JSON.stringify(data)}`);
    }

    console.log("Received response from Perplexity");

    // Create article object
    const article = {
      id: Date.now().toString(),
      content: data.choices[0].message.content,
      timestamp: new Date().toISOString(),
    };

    // Save article using the insertArticle function
    const savedArticle = await insertArticle(article);

    return NextResponse.json(savedArticle);
  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate content: ${error.message}` },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}
