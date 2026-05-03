"use server";

export async function generateContentHelp(prompt: string): Promise<{ 
  success: boolean; 
  text?: string; 
  error?: string 
}> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Using the current stable Gemini 2.5 Flash model on the v1 endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Google API Error:", data.error);
      return { success: false, error: data.error.message };
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return { success: true, text: aiText };
  } catch (error: any) {
    return { success: false, error: "Network block detected. Check your VPN." };
  }
}