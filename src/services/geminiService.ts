
const GEMINI_API_KEY = 'AIzaSyA23xxwOZ9a4cD2m7MeROIAUfSx1Hbdxes';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export interface GeneratedContent {
  summary_text: string;
  linkedin_caption: string;
  instagram_caption: string;
  newsletter_article: string;
}

export const generateEventDocumentation = async (
  eventNotes: string,
  eventTitle: string,
  eventDate: string
): Promise<GeneratedContent> => {
  const prompt = `
    Based on the following event information, generate professional documentation:
    
    Event: ${eventTitle}
    Date: ${eventDate}
    Notes: ${eventNotes}
    
    Please generate:
    1. A formal event summary (2-3 paragraphs)
    2. A LinkedIn caption (professional, 1-2 sentences with hashtags)
    3. An Instagram caption (engaging, with emojis and hashtags)
    4. A newsletter article (formatted HTML, 3-4 paragraphs)
    
    Format the response as JSON with keys: summary_text, linkedin_caption, instagram_caption, newsletter_article
  `;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      summary_text: generatedText,
      linkedin_caption: `Great event: ${eventTitle}! #GDG #Community`,
      instagram_caption: `🚀 Amazing ${eventTitle}! Thanks to everyone who joined! #GDG #Tech`,
      newsletter_article: `<p>${generatedText}</p>`
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};
