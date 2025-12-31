export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json().catch(() => ({}));
    const { businessName = "", city = "", website = "", googleProfile = "", socials = "", mainKeyword = "", extraNotes = "" } = body;

    const systemPrompt = `You are ReinnSolutions AI Visibility Coach. Produce SHORT "AI VISIBILITY SNAPSHOT" reports in this exact format:

=== AI VISIBILITY SNAPSHOT ===
1. Business & Market
2. Google Presence 
3. Website Analysis
4. Social Signals
5. Reviews Strategy
6. Quick Wins (7 days)
7. ReinnSolutions Automation

End ALWAYS with: "Ready for your custom automation? Reply YES"

Tone: Direct, revenue-focused, no fluff.`;

    const aiData = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Business: ${businessName}\nCity: ${city}\nWebsite: ${website}\nGenerate report.` }
      ]
    });

    return Response.json({ report: aiData.response });
  } catch (err) {
    return Response.json({ error: "Try again" }, { status: 500 });
  }
}
