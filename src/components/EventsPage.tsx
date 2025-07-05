
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, createEvent, updateEvent } from "@/services/firestoreService";
import { useAuth } from "@/hooks/useAuth";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Timestamp } from "firebase/firestore";

export const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { userData } = useAuth();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowCreateDialog(false);
    }
  });

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'completed');

  const formatDate = (timestamp: any) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return 'TBD';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'planned':
        return "bg-green-100 text-green-800";
      case 'completed':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleCreateEvent = (eventData: any) => {
    const newEvent = {
      ...eventData,
      created_by: userData?.uid || '',
      date: Timestamp.fromDate(new Date(eventData.date)),
      created_at: Timestamp.now(),
      assigned_members: [],
      tasks: [],
      photos: [],
      status: 'upcoming' as const
    };
    
    createEventMutation.mutate(newEvent);
  };

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage and track your GDG chapter events.</p>
        </div>
        {(userData?.role === 'admin' || userData?.role === 'core') && (
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
          className={activeTab === "upcoming" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          Upcoming Events ({upcomingEvents.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
          className={activeTab === "past" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          Past Events ({pastEvents.length})
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentEvents.length > 0 ? currentEvents.map((event) => (
          <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                <Badge 
                  variant="secondary" 
                  className={getStatusBadge(event.status)}
                >
                  {event.status === 'upcoming' ? 'Open' : event.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {event.tags?.map((tag) => (
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
                  {formatDate(event.date)} at {event.time || 'TBD'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.venue || 'TBD'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  {event.assigned_members?.length || 0} members assigned
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                {activeTab === "upcoming" && (userData?.role === 'admin' || userData?.role === 'core') && (
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No {activeTab} events found</p>
            {activeTab === 'upcoming' && (userData?.role === 'admin' || userData?.role === 'core') && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Event
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateEventDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateEvent}
        isLoading={createEventMutation.isPending}
      />
    </div>
  );
};
