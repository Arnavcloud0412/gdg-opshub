
const GEMINI_API_KEY = 'AIzaSyA23xxwOZ9a4cD2m7MeROIAUfSx1Hbdxes';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface DocumentationResult {
  summary?: string;
  socialMedia?: string;
  blogDraft?: string;
  newsletter?: string;
  text?: string;
}

export const generateEventDocumentation = async (prompt: string): Promise<DocumentationResult> => {
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
            
Based on the following event information, generate four types of content:

1. A professional event summary (2-3 paragraphs)
2. A social media post for LinkedIn/Twitter (engaging, with hashtags)
3. A blog post draft (with markdown formatting)
4. A newsletter summary (concise and friendly)

Event Information: ${prompt}

Please format your response as JSON with keys: summary, socialMedia, blogDraft, newsletter`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
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
        socialMedia: `🚀 Amazing GDG event! ${generatedText.substring(0, 150)}... #GDG #TechCommunity`,
        blogDraft: `# Event Recap\n\n${generatedText}`,
        newsletter: `📱 Event Update\n\n${generatedText.substring(0, 200)}...\n\nBest regards,\nGDG Team`
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const generateImageDescription = async (imageUrl: string, context: string): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Describe this GDG event image in the context of: ${context}`
            },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageUrl
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Vision API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to analyze image';
  } catch (error) {
    console.error('Error calling Gemini Vision API:', error);
    throw error;
  }
};
