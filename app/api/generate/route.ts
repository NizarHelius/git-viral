import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    const groq = new Groq({ apiKey });
    const { content } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `"You are a viral marketing expert. Output your response as a JSON object with a 'posts' array. 
Generate exactly 3 objects in the array:

1. { 'title': 'Post 1: Viral X Hook', 'platform': 'X', 'content': '...single punchy post...' }
2. { 'title': 'Post 2: Professional LinkedIn Post', 'platform': 'LinkedIn', 'content': '...long form professional post...' }
3. { 'title': 'Post 3: Technical X Thread', 'platform': 'X', 'content': '1/n [Detailed Hook]\n\n2/n [Tech Stack Breakdown]\n\n3/n [Problem/Solution logic]\n\n4/n [Architecture details]\n\n5/n [Call to action]\n\n(This object MUST be a multi-post sequence)' }",`,
        },
        { role: "user", content },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }, // This forces JSON
    });

    return NextResponse.json({ data: completion.choices[0]?.message?.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
