export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: body.inputs,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("Groq response:", JSON.stringify(data));

    if (data?.choices?.[0]?.message?.content) {
      return Response.json([{ generated_text: data.choices[0].message.content }]);
    }

    return Response.json({ error: data?.error?.message || "No response from AI" });

  } catch (err) {
    console.error("Route error:", err);
    return Response.json({ error: "AI request failed" });
  }
}