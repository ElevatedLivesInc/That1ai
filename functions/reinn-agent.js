// functions/reinn-agent.js

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}));
    const payload = typeof body === "object" && body !== null ? body : {};

    const {
      businessName = "",
      city = "",
      website = "",
      googleProfile = "",
      socials = "",
      mainKeyword = "",
      extraNotes = "",
    } = payload;

    const systemPrompt = `
You are "Reinn Visibility Coach" – an AI consultant for small local businesses
(hotels, motels, arcades, vape shops, salons, local retail, etc.).

You DO NOT have live access to Google or the web.
You ONLY know what the user tells you about their business.

Your job:
1) Read the info they give you:
   - Business name
   - City / region
   - Website URL
   - Google Business Profile link (if any)
   - Social links
   - Main keyword(s) they want to rank for
   - Extra notes about current struggles

2) Produce a SHORT, CLEAR "AI Visibility Report" in this structure:

=== AI VISIBILITY SNAPSHOT ===
1. Business & Market
2. Google Presence (Profile + Search)
3. Website & Landing
4. Social Media Signal
5. Reviews & Reputation
6. Quick Wins (Next 7 Days)
7. Automation Play from ReinnSolutions

For each section, speak in plain language and focus on:
- Visibility
- Conversions (calls, bookings, sales)
- Simple, realistic moves they can do this month

Always end with:
"Want me to map this automation step-by-step for your business?"

Tone:
- Calm, confident, practical.
- No jargon.
- Talk like a local consultant across the table from them.

If something is missing (no Google link, no socials, etc.), assume a typical
under-optimized small business and provide best-guess guidance instead of
saying "I don't know".
`.trim();

    const userSummary = `
Business name: ${businessName || "N/A"}
City/Region: ${city || "N/A"}
Website: ${website || "N/A"}
Google Business Profile: ${googleProfile || "N/A"}
Social links: ${socials || "N/A"}
Main keyword(s): ${mainKeyword || "N/A"}
Extra notes: ${extraNotes || "N/A"}
`.trim();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content:
              "Here is the business info. Create the full AI Visibility Report now:\n\n" +
              userSummary,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      console.error("OpenAI error:", openaiRes.status, await openaiRes.text());
      return new Response(
        JSON.stringify({ error: "Agent upstream error. Try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await openaiRes.json();
    const reply =
      data.choices?.[0]?.message?.content ??
      "Sorry, something went wrong on my side.";

    return new Response(JSON.stringify({ report: reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Reinn agent error:", err);
    return new Response(
      JSON.stringify({ error: "Reinn Agent crashed. Try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
