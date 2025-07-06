import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Image, Sparkles, Download, Copy, X, Calendar, MapPin, Users } from "lucide-react";
import { generateEventDocumentation } from "@/services/geminiService";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, Event, saveGeneratedDoc, getEventDocumentation } from "@/services/firestoreService";
import ReactMarkdown from 'react-markdown';

// Utility to clean markdown from AI output
function cleanMarkdown(md: string) {
  return md.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
}

export const AIDocsPage = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventNotes, setEventNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    summary: "",
    socialMedia: "",
    blogDraft: "",
    newsletter: "",
    comprehensiveReport: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tabs, setTabs] = useState<Record<string, 'preview' | 'raw'>>({});

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  const { data: existingDoc } = useQuery({
    queryKey: ['event-documentation', selectedEventId],
    queryFn: () => selectedEventId ? getEventDocumentation(selectedEventId) : null,
    enabled: !!selectedEventId
  });

  const saveDocMutation = useMutation({
    mutationFn: ({ eventId, content }: { eventId: string; content: any }) => saveGeneratedDoc(eventId, content),
    onSuccess: () => {
      toast({
        title: "Documentation Saved!",
        description: "Your generated documentation has been saved to the event record."
      });
      queryClient.invalidateQueries({ queryKey: ['event-documentation', selectedEventId] });
    }
  });

  const selectedEvent = events.find(event => event.id === selectedEventId);

  // Load existing documentation when event is selected
  React.useEffect(() => {
    if (existingDoc && Object.keys(existingDoc).length > 0) {
      setGeneratedContent({
        summary: existingDoc.summary || "",
        socialMedia: existingDoc.socialMedia || "",
        blogDraft: existingDoc.blogDraft || "",
        newsletter: existingDoc.newsletter || "",
        comprehensiveReport: existingDoc.comprehensiveReport || existingDoc.text || ""
      });
      toast({
        title: "Documentation Loaded",
        description: "Existing documentation for this event has been loaded."
      });
    }
  }, [existingDoc, toast]);

  const handleGenerate = async () => {
    if (!eventNotes.trim() && !selectedEvent) {
      toast({
        title: "Missing Information",
        description: "Please select an event or enter event notes before generating documentation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      let prompt = "";
      if (selectedEvent) {
        const eventDate = selectedEvent.date?.seconds ? new Date(selectedEvent.date.seconds * 1000).toLocaleDateString() : 'TBD';
        prompt = `You are a professional event documentation assistant for a Google Developer Group (GDG).

Based on the following event information, generate a single, comprehensive, professional event report suitable for sharing with stakeholders and publishing on a blog. The report should be well-structured, use clear headings, and be written in markdown. Do not return a JSON object or multiple sections—just the report.

Event Information:
Title: ${selectedEvent.title}
Description: ${selectedEvent.description}
Date: ${eventDate}
Time: ${selectedEvent.time || 'TBD'}
Venue: ${selectedEvent.venue || 'TBD'}
Tags: ${selectedEvent.tags?.join(', ') || 'N/A'}
Status: ${selectedEvent.status}`;
      } else {
        prompt = `Generate a single, comprehensive, professional event report in markdown based on these notes: ${eventNotes}`;
      }

      const result = await generateEventDocumentation(prompt);
      console.log('AI Response:', result);
      let report = "";
      if (typeof result === "string") {
        report = result;
      } else if (result && typeof result === "object" && "comprehensiveReport" in result) {
        report = result.comprehensiveReport;
      } else {
        report = JSON.stringify(result);
      }
      setGeneratedContent({
        summary: "",
        socialMedia: "",
        blogDraft: "",
        newsletter: "",
        comprehensiveReport: report
      });
      toast({
        title: "Documentation Generated!",
        description: "AI has successfully generated your event documentation."
      });
      if (selectedEvent) {
        saveDocMutation.mutate({ eventId: selectedEvent.id!, content: result });
      }
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

  const handleSaveDocumentation = () => {
    if (!selectedEvent) {
      toast({
        title: "No Event Selected",
        description: "Please select an event to save documentation.",
        variant: "destructive"
      });
      return;
    }

    if (!Object.values(generatedContent).some(content => content)) {
      toast({
        title: "No Content to Save",
        description: "Please generate documentation first.",
        variant: "destructive"
      });
      return;
    }

    // Clean the markdown before saving
    const cleanedContent = {
      ...generatedContent,
      comprehensiveReport: cleanMarkdown(generatedContent.comprehensiveReport)
    };
    saveDocMutation.mutate({ eventId: selectedEvent.id!, content: cleanedContent });
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Documentation Assistant</h1>
          <p className="text-black-600 mt-1">Generate professional event documentation using AI-powered tools.</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <Sparkles className="w-4 h-4 mr-1" />
          Powered by Gemini
        </Badge>
      </div>

      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Form Card */}
        <Card className="border-0 shadow-md w-full">
          <CardHeader>
            <CardTitle className="text-lg">Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Event Selection */}
            <div>
              <Label htmlFor="event-select">Select Event (Optional)</Label>
              <Select
                value={selectedEventId || "none"}
                onValueChange={val => setSelectedEventId(val === "none" ? "" : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an event to auto-fill information" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No event selected</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id!}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Event Info */}
            {selectedEvent && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">{selectedEvent.title}</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {selectedEvent.date?.seconds ? new Date(selectedEvent.date.seconds * 1000).toLocaleDateString() : 'TBD'}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedEvent.venue || 'TBD'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedEvent.assigned_members?.length || 0} members assigned
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">{selectedEvent.description}</p>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="event-notes">Additional Event Notes & Highlights</Label>
              <Textarea
                id="event-notes"
                placeholder="Enter additional key points from your event: attendance, activities, outcomes, feedback, etc."
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                className="min-h-32"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate}
                disabled={(!eventNotes.trim() && !selectedEvent) || isGenerating}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
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
              
              {selectedEvent && Object.values(generatedContent).some(content => content) && (
                <Button 
                  onClick={handleSaveDocumentation}
                  disabled={saveDocMutation.isPending}
                  variant="outline"
                  className="px-4"
                >
                  {saveDocMutation.isPending ? "Saving..." : "Save to Event"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Card */}
        {generatedContent.comprehensiveReport && (
          <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-200 w-full">
            {/* Official Report Header */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="/icon.png"
                alt="GDG Logo"
                className="w-16 h-16 mb-2 rounded-full shadow"
              />
              <div className="text-xl font-bold text-gray-800 tracking-wide">Google Developer Group</div>
              <div className="text-base text-blue-700 font-medium">Official Event Report</div>
              <hr className="w-24 border-t-2 border-blue-200 mt-4" />
            </div>
            
            {/* Markdown Content with Proper Rendering */}
            <div className="overflow-auto max-h-[70vh]">
              <div className="prose prose-lg max-w-none text-gray-900 
                prose-headings:text-blue-800 prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-blue-700 prose-strong:font-semibold
                prose-em:text-gray-700 prose-em:italic
                prose-blockquote:border-l-4 prose-blockquote:border-blue-300 
                prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:bg-blue-50
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1
                prose-li:text-gray-800 prose-li:leading-relaxed
                prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                prose-hr:border-gray-300 prose-hr:my-6
                prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-bold text-blue-800 mt-8 mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold text-blue-800 mt-6 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-bold text-blue-800 mt-4 mb-2">{children}</h3>,
                    p: ({children}) => <p className="text-base leading-relaxed mb-4 text-gray-900">{children}</p>,
                    strong: ({children}) => <strong className="font-semibold text-blue-700">{children}</strong>,
                    em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                    ul: ({children}) => <ul className="list-disc pl-6 space-y-1 mb-4">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-6 space-y-1 mb-4">{children}</ol>,
                    li: ({children}) => <li className="text-gray-800 leading-relaxed">{children}</li>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-blue-300 pl-4 py-2 bg-blue-50 my-4 italic">
                        {children}
                      </blockquote>
                    ),
                    code: ({children}) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({children}) => (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                        {children}
                      </pre>
                    ),
                    hr: () => <hr className="border-gray-300 my-6" />,
                    a: ({children, href}) => (
                      <a href={href} className="text-blue-600 underline hover:text-blue-800">
                        {children}
                      </a>
                    )
                  }}
                >
                  {cleanMarkdown(generatedContent.comprehensiveReport)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
