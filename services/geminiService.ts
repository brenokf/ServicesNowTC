
import { GoogleGenAI } from "@google/genai";

// Always initialize with process.env.GEMINI_API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

export const getSystemInsights = async (systemData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following system data and provide a brief professional summary (under 100 words) for a dashboard executive view. Mention any potential issues or trends: ${JSON.stringify(systemData)}`,
      config: {
        systemInstruction: "You are a professional system operations analyst for Nexus Corp. Speak concisely and highlight operational health.",
      }
    });
    // Accessing .text as a property, not a method, as per guidelines
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Insights unavailable. Please check system logs.";
  }
};
