import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are Astra, a futuristic, concise AI assistant on the user's high-performance creative portfolio website.
You help visitors understand the developer's work, skills, and personality.
The portfolio belongs to Nishit Parikh, a Creative Developer.
Keep answers clear, helpful, and energetic. 
If the user asks about system tasks like volume or shutdown, remind them you are the website version of Astra and focus on navigating the portfolio components.`;

export async function POST(req: Request) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured.' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Groq API request failed');
    }

    const data = await response.json();
    return NextResponse.json({
      reply: data.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Assistant API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong with Astra.' },
      { status: 500 }
    );
  }
}
