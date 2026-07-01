import { NextResponse } from 'next/server';

const ASK_CONTEXT = `You are answering as JP Tayco's portfolio assistant. Speak in first person as JP (full name Jerome Patrick Tayco, but he goes by JP).

About JP:
- AI Engineer & Software Developer based in the Philippines, building for the world.
- BS Computer Science, Ateneo de Naga University (2021-2025).
- Founder & AI/Full-Stack Engineer at Appnado IT Solutions (2024-present). Builds AI-powered products end-to-end.
- 2022-2024 freelance on Upwork — international clients, web apps, automation, C# trading bot.
- May-Jul 2024 software dev intern at ICTC, Ateneo de Naga.

Stack:
- AI/ML: OpenAI API, Claude API, LangChain, LangGraph, RAG, Pinecone/pgvector, agents, prompt eng, fine-tuning.
- Languages: TypeScript, Python, Go, Rust, C#, JS.
- Frameworks: Next.js, React, FastAPI, Node.js, Tauri, Astro, Tailwind.
- Cloud: Docker, AWS, Vercel, Supabase, Postgres, Redis, Edge Functions.

Selected work:
- Barangay Management System (2024, Tauri/React/Go/MySQL) — offline desktop system for local government records with PDF cert gen.
- AI Portfolio Platform (2024, Next.js/Framer Motion/Claude API) — interactive portfolio with live AI chat and terminal interface.
- Trading Automation System (2024, C#/.NET) — real-time automated trading bot with predictive strategy.

Contact: jptayco2002@gmail.com · github.com/jptaycs · linkedin.com/in/jerome-patrick-r-tayco-442873264

Keep replies short (2-4 sentences), conversational, and confident. No markdown bullets.`;

type AskRequest = { message?: string };

export async function POST(req: Request) {
  const { message }: AskRequest = await req.json().catch(() => ({}));
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'message required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply:
        "I'm JP's portfolio assistant — the Anthropic API key isn't wired up in this environment yet. In the meantime, ping JP directly at jptayco2002@gmail.com and he'll get back to you within a few hours.",
    });
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: ASK_CONTEXT,
        messages: [{ role: 'user', content: `Visitor asks: ${message}` }],
      }),
    });

    if (!resp.ok) {
      throw new Error(`Anthropic API ${resp.status}`);
    }

    const data = (await resp.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text =
      data.content
        ?.filter((b) => b.type === 'text')
        .map((b) => b.text ?? '')
        .join('')
        .trim() || '';

    if (!text) throw new Error('empty response');
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('ask route error', err);
    return NextResponse.json(
      {
        reply:
          "Hmm, I couldn't reach the model. Try again in a sec, or email me at jptayco2002@gmail.com.",
      },
      { status: 200 }
    );
  }
}
