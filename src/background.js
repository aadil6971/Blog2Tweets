import { openaiFetch } from "./helpers/openai.js";

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.action !== "generateTweets") return;
  (async () => {
    try {
      const { content, apiKey, tweetCount } = msg;
      // Split into paragraphs
      const paras = content
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 100);
      const embedRes = await openaiFetch(
        "embeddings",
        { model: "text-embedding-ada-002", input: paras },
        apiKey
      );
      const paraEmbeds = embedRes.data.map((d) => d.embedding);
      const docRes = await openaiFetch(
        "embeddings",
        { model: "text-embedding-ada-002", input: content },
        apiKey
      );
      const docEmbed = docRes.data[0].embedding;
      // Cosine similarity
      const cosine = (a, b) => {
        const dot = a.reduce((sum, x, i) => sum + x * b[i], 0);
        const mag = (v) => Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
        return dot / (mag(a) * mag(b));
      };
      // Rank paragraphs
      const scored = paras.map((t, i) => ({
        text: t,
        score: cosine(docEmbed, paraEmbeds[i]),
      }));
      scored.sort((a, b) => b.score - a.score);
      const top5 = scored
        .slice(0, 5)
        .map((o) => o.text)
        .join("\n\n");
      // Generate tweets with dynamic count
      const prompt = `You are a social media strategist. Key points:\n${top5}\n\nWrite ${tweetCount} concise, engaging tweets (<=280 chars) reflecting the page tone.`;
      const chat = await openaiFetch(
        "chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Generate engaging tweets." },
            { role: "user", content: prompt },
          ],
          max_tokens: 800,
          temperature: 0.8,
        },
        apiKey
      );
      const tweets = chat.choices[0].message.content
        .trim()
        .split(/\r?\n/)
        .filter((l) => l);
      respond({ tweets });
    } catch (err) {
      respond({ error: err.message });
    }
  })();
  return true;
});
