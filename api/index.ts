import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AQ.Ab8RN6Jlkyz3qXjsf2cH2IDvRDSXGH64ZdWxgxIyqC1VBPZjvg",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    const model = ai.models.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(prompt);
    res.json({ response: result.response.text() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
