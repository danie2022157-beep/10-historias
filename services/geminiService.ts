import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Generates a story illustration using the Gemini API.
   * Following best practices, a new GoogleGenAI instance is created right before the API call.
   */
  async generateStoryImage(prompt: string): Promise<string | null> {
    try {
      // Use the direct process.env.API_KEY string for client initialization as required.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      // Iterate through candidates and all parts to find the image data.
      // Do not assume the first part contains the image.
      if (response.candidates && response.candidates[0]) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString: string = part.inlineData.data;
            return `data:image/png;base64,${base64EncodeString}`;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
