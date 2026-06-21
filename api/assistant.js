import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
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
    
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (parseError) {
      jsonResponse = { action: "answer", "response": "I didn't quite catch that. Could you repeat?" };
    }

    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
