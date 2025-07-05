
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Sparkles, Download, Copy } from "lucide-react";
import { generateEventDocumentation } from "@/services/geminiService";
import { useToast } from "@/hooks/use-toast";

export const AIDocsPage = () => {
  const [eventNotes, setEventNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    summary: "",
    socialMedia: "",
    blogDraft: "",
    newsletter: ""
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!eventNotes.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter event notes before generating documentation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Generate professional event documentation based on these notes: ${eventNotes}`;
      const result = await generateEventDocumentation(prompt);
      
      // Parse the AI response and extract different content types
      setGeneratedContent({
        summary: result.summary || result.text || "Event summary generated successfully.",
        socialMedia: result.socialMedia || "🚀 Amazing event with our GDG community! Thanks to all participants for making it an incredible learning experience! #GDG #TechCommunity",
        blogDraft: result.blogDraft || `# Event Recap\n\n${result.text || eventNotes}\n\nThe event was a great success with active participation from our community members.`,
        newsletter: result.newsletter || `📱 Event Recap\n\nOur recent event was a fantastic success! Here's what happened:\n\n${eventNotes}\n\nThank you to everyone who participated.\n\nBest regards,\nGDG Team`
      });

      toast({
        title: "Documentation Generated!",
        description: "AI has successfully generated your event documentation."
      });
    } catch (error) {
      console.error('Error generating documentation:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate documentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`
      });
    });
  };

  const contentTypes = [
    { key: "summary", title: "Event Summary", icon: FileText, color: "text-blue-600" },
    { key: "socialMedia", title: "Social Media Post", icon: Sparkles, color: "text-green-600" },
    { key: "blogDraft", title: "Blog Draft", icon: FileText, color: "text-purple-600" },
    { key: "newsletter", title: "Newsletter Content", icon: FileText, color: "text-orange-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Documentation Assistant</h1>
          <p className="text-gray-600 mt-1">Generate professional event documentation using AI-powered tools.</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <Sparkles className="w-4 h-4 mr-1" />
          Powered by Gemini
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Notes & Highlights
              </label>
              <Textarea
                placeholder="Enter key points from your event: attendance, activities, outcomes, feedback, etc."
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                className="min-h-32"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Upload Event Materials (Coming Soon)
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2" disabled>
                  <Image className="w-6 h-6 text-gray-400" />
                  <span className="text-sm">Upload Photos</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2" disabled>
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm">Upload Files</span>
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={!eventNotes.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Documentation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.values(generatedContent).some(content => content) ? (
              <div className="space-y-4">
                {contentTypes.map((type) => {
                  const content = generatedContent[type.key as keyof typeof generatedContent];
                  if (!content) return null;
                  
                  const Icon = type.icon;
                  return (
                    <div key={type.key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${type.color}`} />
                          {type.title}
                        </h4>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(content, type.title)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" disabled>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Enter event details and click "Generate Documentation" to see AI-powered content here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
