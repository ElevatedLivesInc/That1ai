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
  const openaiResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
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
    },
  );

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
<!DOCTYPE html>
<html>
<head>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      background: radial-gradient(circle at center, #ff00ff, #000000);
      transition: background 0.1s linear;
      overflow: hidden;
      font-family: sans-serif;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div>listening to you…</div>
  <script>
    async function start() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function tick() {
        analyser.getByteFrequencyData(data);
        const level = data.reduce((a, v) => a + v, 0) / data.length;
        const intensity = Math.min(level / 255, 1);
        const hue = 200 + intensity * 160; // blue → magenta
        const glow = 10 + intensity * 40;

        document.body.style.background =
          `radial-gradient(circle at center,
             hsl(${hue}, 90%, ${40 + intensity * 20}%),
             #000000 ${glow}%)`;

        requestAnimationFrame(tick);
      }
      tick();
    }
    start();
  </script>
</body>
</html>
