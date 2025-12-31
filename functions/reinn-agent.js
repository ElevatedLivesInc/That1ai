export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}));
    const { businessName = "", city = "", website = "", googleProfile = "", socials = "", mainKeyword = "", extraNotes = "" } = body;

    const systemPrompt = `You are "Reinn Visibility Coach" – an AI consultant for small local businesses.
You ONLY know what the user tells you about their business.

Produce a SHORT, CLEAR "AI Visibility Report" in this structure:
=== AI VISIBILITY SNAPSHOT ===
1. Business & Market
2. Google Presence (Profile + Search)  
3. Website & Landing
4. Social Media Signal
5. Reviews & Reputation
6. Quick Wins (Next 7 Days)
7. Automation Play from ReinnSolutions

Always end with: "Want me to map this automation step-by-step for your business?"

Tone: Calm, confident, practical. No jargon.`;

    const userSummary = `Business: ${businessName || "N/A"}
City: ${city || "N/A"}
Website: ${website || "N/A"}
Google Profile: ${googleProfile || "N/A"}
Socials: ${socials || "N/A"}
Keywords: ${mainKeyword || "N/A"}
Notes: ${extraNotes || "N/A"}`;

    // FREE Cloudflare Workers AI (no OpenAI key needed)
    const aiData = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create the full AI Visibility Report:\n\n${userSummary}` }
      ]
    });

    return new Response(JSON.stringify({ report: aiData.response || "Error generating report" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Agent error. Try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
