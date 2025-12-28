// functions/reinn-agent.js

export async function onRequest(context) {
  // For now, just prove the agent endpoint is alive
  const data = {
    ok: true,
    agent: "Signal OG",
    message: "Signal OG agent is alive on Cloudflare Pages.",
    method: context.request.method,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
