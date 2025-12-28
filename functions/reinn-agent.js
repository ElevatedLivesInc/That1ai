// functions/reinn-agent.js
// Cloudflare Pages Function that talks to OpenAI

export async function onRequest(context) {
  const { request, env } = context;

  // If someone just opens /reinn-agent in a browser, show a simple status
  if (request.method !== "POST") {
    const info = {
      ok: true,
      agent: "Signal OG",
      message: "Send a POST with { message: \"...\" } to talk to OpenAI.",
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(info, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Try to read JSON body from the request
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    // ignore, will fall back to default prompt
  }

  const userMessage =
    body.message || "Write a short, friendly greeting from the Signal OG agent.";

  // Call OpenAI from the backend (never expose your key to the browser)
  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Set OPENAI_API_KEY in Cloudflare Pages project settings
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Signal OG, a sharp but helpful AI sales and ops agent for Elevated Lives and Rein N Solutions. Be clear and concise.",
        },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!openaiResponse.ok) {
    const text = await openaiResponse.text();
    return new Response(
      JSON.stringify(
        {
          ok: false,
          error: "OpenAI API error",
          status: openaiResponse.status,
          body: text,
        },
        null,
        2,
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const data = await openaiResponse.json();
  const reply = data.choices?.[0]?.message?.content || "";

  return new Response(
    JSON.stringify(
      {
        ok: true,
        agent: "Signal OG",
        reply,
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
