import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateWithGroq = async (prompt, options = {}) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: options.systemPrompt || "You are an AI Career Coach. You respond EXACTLY like ChatGPT. Analyze the user's question carefully. If the question is short and simple, give a short and simple answer. If the question asks for details, give a detailed answer. Match your response length and complexity to the user's question. Be natural and helpful. No fixed length rules - just respond appropriately."
        },
        { role: "user", content: prompt }
      ],
      model: options.model || "llama-3.3-70b-versatile",
      temperature: options.temperature || 0.7,
      max_completion_tokens: options.maxTokens || 800,
    });

    return completion.choices[0]?.message?.content || "No response";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};

export const generateJSONResponse = async (prompt, fallbackData = {}) => {
  try {
    const response = await generateWithGroq(
      prompt + "\n\nReturn ONLY valid JSON. No extra text.",
      { maxTokens: 2000 }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    return fallbackData;
  }
};