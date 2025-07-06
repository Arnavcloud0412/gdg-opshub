import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Users, CheckCircle, Plus, X, FileText, Sparkles } from "lucide-react";
import { Event, Member, Task } from "@/services/firestoreService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMembers, getTasks, createTask, updateEvent, saveGeneratedDoc, addXpToMembersForEvent } from "@/services/firestoreService";
import { generateEventDocumentation } from "@/services/geminiService";
import { Timestamp } from "firebase/firestore";

interface EventManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEventUpdate: (eventId: string, eventData: any) => void;
  isLoading: boolean;
}

export const EventManageDialog = ({ 
  open, 
  onOpenChange, 
  event, 
  onEventUpdate, 
  isLoading 
}: EventManageDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    assigned_to: "",
    due_date: "",
    points: 10
  });
  const [generatedDocs, setGeneratedDocs] = useState<any>(null);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);

  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTask({
        title: "",
        assigned_to: "",
        due_date: "",
        points: 10
      });
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  if (!event) return null;

  const eventTasks = tasks.filter(task => task.event_id === event.id);
  const assignedMembers = members.filter(member => 
    event.assigned_members?.includes(member.id || '')
  );

  const handleMemberToggle = (memberId: string) => {
    const currentMembers = event.assigned_members || [];
    const newMembers = currentMembers.includes(memberId)
      ? currentMembers.filter(id => id !== memberId)
      : [...currentMembers, memberId];
    
    onEventUpdate(event.id!, { assigned_members: newMembers });
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assigned_to || !newTask.due_date) return;

    const taskData = {
      title: newTask.title,
      event_id: event.id!,
      assigned_to: newTask.assigned_to,
      assigned_by: event.created_by,
      status: 'pending' as const,
      due_date: Timestamp.fromDate(new Date(newTask.due_date)),
      points: newTask.points,
      created_at: Timestamp.now()
    };

    createTaskMutation.mutate(taskData);
  };

  const handleStatusChange = async (status: string) => {
    // Only award XP if changing from non-completed to completed
    if (status === "completed" && event.status !== "completed") {
      // Award 50 XP to each assigned member
      if (event.assigned_members && event.assigned_members.length > 0 && event.id) {
        await addXpToMembersForEvent(event.assigned_members, event.id, 50);
        // Optionally, you could show a toast/notification here
      }
    }
    onEventUpdate(event.id!, { status });
  };

  const handleGenerateDocumentation = async () => {
    if (!event) return;
    
    setIsGeneratingDocs(true);
    try {
      const eventPrompt = `
        Event Title: ${event.title}
        Description: ${event.description}
        Date: ${formatDate(event.date)}
        Time: ${event.time || 'TBD'}
        Venue: ${event.venue || 'TBD'}
        Tags: ${event.tags?.join(', ') || 'N/A'}
        Assigned Members: ${assignedMembers.map(m => m.name).join(', ')}
        Status: ${event.status}
      `;
      
      const docs = await generateEventDocumentation(eventPrompt);
      setGeneratedDocs(docs);
      
      // Save to Firestore
      await saveGeneratedDoc(event.id!, docs);
    } catch (error) {
      console.error('Error generating documentation:', error);
    } finally {
      setIsGeneratingDocs(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return 'TBD';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Manage Event: {event.title}</DialogTitle>
        </DialogHeader>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "details" ? "default" : "ghost"}
            onClick={() => setActiveTab("details")}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Details
          </Button>
          <Button
            variant={activeTab === "members" ? "default" : "ghost"}
            onClick={() => setActiveTab("members")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Members ({assignedMembers.length})
          </Button>
          <Button
            variant={activeTab === "tasks" ? "default" : "ghost"}
            onClick={() => setActiveTab("tasks")}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Tasks ({eventTasks.length})
          </Button>
          <Button
            variant={activeTab === "documentation" ? "default" : "ghost"}
            onClick={() => setActiveTab("documentation")}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Documentation
          </Button>
        </div>

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={event.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={event.title} disabled />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={event.description} disabled />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input value={formatDate(event.date)} disabled />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input value={event.time || 'TBD'} disabled />
                  </div>
                </div>
                <div>
                  <Label>Venue</Label>
                  <Input value={event.venue || 'TBD'} disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assign Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={event.assigned_members?.includes(member.id || '')}
                        onCheckedChange={() => handleMemberToggle(member.id || '')}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <p className="text-xs text-gray-400">{member.skills?.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Task Title</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Set up registration booth"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assign To</Label>
                    <Select value={newTask.assigned_to} onValueChange={(value) => setNewTask(prev => ({ ...prev, assigned_to: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignedMembers.map(member => (
                          <SelectItem key={member.id} value={member.id || ''}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={newTask.points}
                    onChange={(e) => setNewTask(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    min="1"
                    max="100"
                  />
                </div>
                <Button 
                  onClick={handleCreateTask}
                  disabled={!newTask.title || !newTask.assigned_to || !newTask.due_date || createTaskMutation.isPending}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {eventTasks.length > 0 ? (
                  <div className="space-y-3">
                    {eventTasks.map(task => {
                      const taskMember = members.find(m => m.id === task.assigned_to);
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500">
                              Assigned to: {taskMember?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Due: {formatDate(task.due_date)} • {task.points} points
                            </p>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={
                              task.status === 'done' ? 'bg-green-100 text-green-800' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No tasks created yet</p>
                )}
              </CardContent>
            </Card>
                   </div>
       )}

       {/* Documentation Tab */}
       {activeTab === "documentation" && (
         <div className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Sparkles className="w-5 h-5" />
                 Generate Event Documentation
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <p className="text-gray-600">
                 Generate professional documentation for this event including summaries, social media posts, and blog drafts.
               </p>
               
               <Button 
                 onClick={handleGenerateDocumentation}
                 disabled={isGeneratingDocs}
                 className="w-full"
               >
                 <Sparkles className="w-4 h-4 mr-2" />
                 {isGeneratingDocs ? "Generating..." : "Generate Documentation"}
               </Button>

               {generatedDocs && (
                 <div className="space-y-4 mt-6">
                   <div>
                     <h4 className="font-semibold mb-2">Event Summary</h4>
                     <div className="p-3 bg-gray-50 rounded-lg text-sm">
                       {generatedDocs.summary || generatedDocs.text}
                     </div>
                   </div>
                   
                   <div>
                     <h4 className="font-semibold mb-2">Social Media Post</h4>
                     <div className="p-3 bg-blue-50 rounded-lg text-sm">
                       {generatedDocs.socialMedia}
                     </div>
                   </div>
                   
                   <div>
                     <h4 className="font-semibold mb-2">Blog Draft</h4>
                     <div className="p-3 bg-green-50 rounded-lg text-sm max-h-40 overflow-y-auto">
                       <pre className="whitespace-pre-wrap">{generatedDocs.blogDraft}</pre>
                     </div>
                   </div>
                   
                   <div>
                     <h4 className="font-semibold mb-2">Newsletter</h4>
                     <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                       {generatedDocs.newsletter}
                     </div>
                   </div>
                 </div>
               )}
             </CardContent>
           </Card>
         </div>
       )}

       <div className="flex justify-end gap-2 pt-4">
         <Button variant="outline" onClick={() => onOpenChange(false)}>
           Close
         </Button>
       </div>
     </DialogContent>
   </Dialog>
 );
}; 