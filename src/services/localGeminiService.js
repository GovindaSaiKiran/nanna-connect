import { GoogleGenerativeAI } from '@google/generative-ai';

export const localGeminiService = {
  processTranscript: async (transcript) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is missing in .env');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are Nanna AI, an elderly assistance AI. The user has said: "${transcript}".
You must output ONLY valid JSON. Do not include markdown formatting or backticks.
If the user is asking to navigate, call someone, or trigger an app action that the local engine missed, return:
{ "action": "navigate", "target": "SOS" } or { "action": "call_relationship", "relationship": "son" }
If the user is asking a general question (e.g. health, weather, device usage), return:
{ "action": "answer", "response": "Your spoken answer here." }
Response must be in the same language as the transcript. Keep answers short and polite.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      return { action: "answer", "response": "I didn't quite catch that. Could you repeat?" };
    }
  }
};
