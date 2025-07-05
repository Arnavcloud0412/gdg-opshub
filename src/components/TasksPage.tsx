
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, User, CheckCircle, Clock, AlertCircle } from "lucide-react";

export const TasksPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const tasks = [
    {
      id: 1,
      title: "Design event poster for Android Meetup",
      description: "Create promotional material for the upcoming Android development meetup",
      assignee: "Maya Patel",
      dueDate: "Dec 18, 2024",
      status: "In Progress",
      event: "Android Dev Meetup",
      priority: "High",
      xpReward: 50
    },
    {
      id: 2,
      title: "Setup registration system",
      description: "Configure Google Forms and manage RSVP tracking",
      assignee: "Alex Rodriguez",
      dueDate: "Dec 19, 2024",
      status: "Assigned",
      event: "AI/ML Study Jam",
      priority: "Medium",
      xpReward: 30
    },
    {
      id: 3,
      title: "Prepare workshop materials",
      description: "Create slides and code examples for the hands-on session",
      assignee: "Sarah Chen",
      dueDate: "Dec 21, 2024",
      status: "Done",
      event: "AI/ML Study Jam",
      priority: "High",
      xpReward: 75
    },
    {
      id: 4,
      title: "Book venue and equipment",
      description: "Reserve room and ensure AV equipment is available",
      assignee: "Jordan Kim",
      dueDate: "Dec 17, 2024",
      status: "Assigned",
      event: "Android Dev Meetup",
      priority: "High",
      xpReward: 40
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Assigned":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = statusFilter === "all" 
    ? tasks 
    : tasks.filter(task => task.status.toLowerCase().replace(" ", "-") === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Track and manage event-related tasks and assignments.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(task.status)}
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {task.assignee}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due {task.dueDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-600">★</span>
                      {task.xpReward} XP
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600 font-medium">
                  Event: {task.event}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
