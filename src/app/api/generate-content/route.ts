import { NextResponse } from "next/server";
import { saveNews } from "@/lib/storage";

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error("PERPLEXITY_API_KEY is not set");
}

export async function GET() {
  try {
    console.log("Starting content generation...");

    const prompt = `“Summarize the latest global and U.S. key headlines from the past 12 hours. Include:
    - Major U.S. news headlines (politics, economy, regulations, Fed updates, etc.)
    - Recent macroeconomic data (inflation, interest rates, unemployment, GDP, etc.)
    - Key international news (geopolitics, economic policies, global conflicts, etc.)
    - Geopolitical developments (e.g., conflicts, trade wars, government actions)
    - Global stock market trends (U.S., Europe, Asia)
    - Commodity and currency movements (oil, gold, USD, yields, etc.)

    Then, analyze how each major news item might impact the stock market:
    - Label each as bullish or bearish
    - Briefly explain the reasoning behind each label
    - Mention which sectors, ETFs, or specific stocks are likely to be affected

    This summary will be used for daily premarket prep for traders and investors.
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
            content:
              "You are a helpful assistant that provides accurate and up-to-date information in a concise manner.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Perplexity API error: ${response.status} ${response.statusText} - ${responseText}`
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

    // Save the generated content
    const savedNews = saveNews(data.choices[0].message.content);

    return NextResponse.json(savedNews);
  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate content: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
