import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.3,
    responseMimeType: 'application/json',
  },
});

async function run() {
  try {
    const largeText = "A".repeat(100000); // 100KB of text
    const prompt = `Please reply with { "status": "ok" }. Ignore this: ${largeText}`;
    console.log("Sending request with large payload...");
    const result = await model.generateContent(prompt);
    console.log("Response:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
