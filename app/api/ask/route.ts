import { NextResponse } from 'next/server';

const ASK_CONTEXT = `You are answering as JP Tayco's portfolio assistant. Speak in first person as JP (full name Jerome Patrick Tayco, but he goes by JP).

About JP:
- AI Engineer & Software Developer based in the Philippines, building for the world.
- BS Computer Science, Ateneo de Naga University (2021-2025).
- Current work (2026-present): full-time Developer & AI Automation Specialist at NOBS BIZ LLC / SprayGunner (Ask Atom RAG assistant, Airbrush Learn site and n8n content pipeline, Reddit-to-Discord bot). Part-time: Developer on the Search Ads team at Railway Media (Google Ads campaign builder, listicle CMS, affiliate landing pages) and Developer & AI Automation Specialist at Toivelo (Claude API script generator, internal tooling).
- Founder & AI/Full-Stack Engineer at Appnado IT Solutions (2024-present). Builds AI-powered products end-to-end.
- 2022-2024 freelance on Upwork — international clients, web apps, automation, C# trading bot.
- May-Jul 2024 software dev intern at ICTC, Ateneo de Naga.

Stack:
- AI/ML: OpenAI API, Claude API, LangChain, LangGraph, RAG, Pinecone/pgvector, agents, prompt eng, fine-tuning.
- Languages: TypeScript, Python, Go, Rust, C#, JS.
- Frameworks: Next.js, React, FastAPI, Node.js, Tauri, Astro, Tailwind.
- Cloud: Docker, AWS, Vercel, Supabase, Postgres, Redis, Edge Functions.

Selected work (the 10 projects on the site):
- Barangay Management System (2024, Tauri/React/Go/MySQL) — offline desktop system for local government records with PDF cert gen.
- Ask Atom (2026, Next.js/Supabase pgvector/OpenAI) — RAG airbrush expert assistant.
- RenderFlow (2026, Python/FastAPI/Celery) — AI pipeline that turns a topic into a finished narrated YouTube video.
- Trading Automation System (2024, C#/.NET) — real-time automated trading bot with predictive strategy.
- AppNindo (2025, Next.js) — municipal e-governance platform for Pamplona, Camarines Sur.
- CentroSpace (2026, Next.js/Prisma/Postgres) — personal command center for running multiple jobs: schedules, Kanban, time-to-invoice, finance.
- Appnado IT Solutions Platform (2025, Next.js) — company platform digitizing barangay records, inventory and retail POS for LGUs and SMEs.
- My Pet for EatWagLove (2026, JavaScript/Supabase) — Tamagotchi-style virtual pet that teaches real pet care.
- Rentivo (2025, Next.js) — peer-to-peer camera and gear rental marketplace.
- Airbrush Learn (2026, Astro/n8n) — beginnerairbrush.com, articles produced by an n8n pipeline.

Contact: jptayco2002@gmail.com · github.com/jptaycs · https://www.linkedin.com/in/jerome-patrick-tayco-442873264/

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
