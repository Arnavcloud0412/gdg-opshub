
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, Users } from "lucide-react";

export const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const events = {
    upcoming: [
      {
        id: 1,
        title: "Android Dev Meetup",
        date: "Dec 20, 2024",
        time: "6:00 PM",
        venue: "Tech Hub, Room 101",
        description: "Learn the latest Android development techniques and network with fellow developers.",
        attendees: 18,
        maxAttendees: 30,
        tags: ["Android", "Mobile"],
        status: "Open"
      },
      {
        id: 2,
        title: "AI/ML Study Jam",
        date: "Dec 22, 2024",
        time: "2:00 PM",
        venue: "Computer Lab B",
        description: "Hands-on machine learning workshop using Google's TensorFlow and Vertex AI.",
        attendees: 32,
        maxAttendees: 40,
        tags: ["AI/ML", "TensorFlow"],
        status: "Almost Full"
      }
    ],
    past: [
      {
        id: 3,
        title: "Google Cloud Workshop",
        date: "Dec 15, 2024",
        time: "3:00 PM",
        venue: "Main Auditorium",
        description: "Introduction to Google Cloud Platform and serverless computing.",
        attendees: 25,
        maxAttendees: 25,
        tags: ["GCP", "Cloud"],
        status: "Completed"
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage and track your GDG chapter events.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
          className={activeTab === "upcoming" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          Upcoming Events
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
          className={activeTab === "past" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          Past Events
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events[activeTab as keyof typeof events].map((event) => (
          <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`
                    ${event.status === "Open" ? "bg-green-100 text-green-800" : ""}
                    ${event.status === "Almost Full" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${event.status === "Completed" ? "bg-gray-100 text-gray-800" : ""}
                  `}
                >
                  {event.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  {event.attendees}/{event.maxAttendees} attendees
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                {activeTab === "upcoming" && (
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
