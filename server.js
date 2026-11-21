import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "30kb" }));
app.use(express.static(path.join(__dirname, "public")));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "অনেকগুলো অনুরোধ হয়েছে। এক মিনিট পরে আবার চেষ্টা করো।" }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, assistant: "SANCHITA AI", aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "AI চালু করতে server-এর environment variables-এ OPENAI_API_KEY যোগ করতে হবে।"
      });
    }

    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return res.status(400).json({ error: "সঠিক chat messages পাঠাও (সর্বোচ্চ ১২টি)।" });
    }

    const cleanMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 4000)
    })).filter((m) => m.content.trim());

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.AI_MODEL || "gpt-5.5",
      instructions: [
        "Your name is SANCHITA AI, a friendly personal assistant.",
        "Reply in Bengali when the user writes Bengali or Banglish; reply in English when the user writes English.",
        "Be clear, warm, concise, and practical. Do not claim to perform actions on the device that you cannot perform.",
        "For dangerous, medical, legal, or financial matters, give cautious general information and encourage appropriate professional help."
      ].join(" "),
      input: cleanMessages
    });

    res.json({ reply: response.output_text || "দুঃখিত, এবার উত্তর তৈরি করতে পারলাম না।" });
  } catch (error) {
    console.error("Chat API error:", error?.message || error);
    res.status(500).json({ error: "AI সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করো।" });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`SANCHITA AI running on port ${PORT}`));
