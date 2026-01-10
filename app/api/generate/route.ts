import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    // 1. Check if API Key exists
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("ERROR: GROQ_API_KEY is missing from .env.local");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a viral marketing expert for developers. Convert the following README/code into 3 posts: 1. A hype X post. 2. A professional LinkedIn post. 3. A technical educational thread. Format in Markdown.",
        },
        { role: "user", content: content },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ data: completion.choices[0]?.message?.content });
  } catch (error: any) {
    console.error("GROQ API ERROR:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
