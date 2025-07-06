
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyA23xxwOZ9a4cD2m7MeROIAUfSx1Hbdxes';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
export interface DocumentationResult {
  summary?: string;
  socialMedia?: string;
  blogDraft?: string;
  newsletter?: string;
  comprehensiveReport?: string;
  text?: string;
}

export const generateEventDocumentation = async (prompt: string): Promise<DocumentationResult> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional event documentation assistant for a Google Developer Group (GDG). 
            
Based on the following event information, generate comprehensive documentation including:

1. A professional event summary (2-3 paragraphs highlighting key achievements, attendance, and outcomes)
2. A social media post for LinkedIn/Twitter (engaging, with relevant hashtags like #GDG #TechCommunity #DeveloperCommunity)
3. A blog post draft (with markdown formatting, including sections for overview, highlights, key takeaways, and future events)
4. A newsletter summary (concise and friendly tone for community updates)
5. A comprehensive event report (detailed analysis including technical details, community engagement, and impact metrics)

Event Information: ${prompt}

Please format your response as JSON with keys: summary, socialMedia, blogDraft, newsletter, comprehensiveReport. Make the content engaging, professional, and suitable for a tech community audience.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse as JSON first
    try {
      const parsedContent = JSON.parse(generatedText);
      return parsedContent;
    } catch {
      // If not JSON, parse manually or return as summary
      return {
        text: generatedText,
        summary: generatedText.split('\n\n')[0] || generatedText,
        socialMedia: `🚀 Amazing GDG event! ${generatedText.substring(0, 150)}... #GDG #TechCommunity #DeveloperCommunity`,
        blogDraft: `# Event Recap\n\n${generatedText}`,
        newsletter: `📱 Event Update\n\n${generatedText.substring(0, 200)}...\n\nBest regards,\nGDG Team`,
        comprehensiveReport: generatedText
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

