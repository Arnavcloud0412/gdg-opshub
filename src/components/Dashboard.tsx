
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CheckSquare, TrendingUp, Plus, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getEvents, getTasks, getMembers } from "@/services/firestoreService";

export const Dashboard = () => {
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers
  });

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const activeTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in_progress');
  const topContributors = members
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 3)
    .map(member => ({
      name: member.name,
      role: member.role,
      xp: member.xp,
      avatar: member.name.split(' ').map(n => n[0]).join('')
    }));

  const stats = [
    { 
      title: "Total Members", 
      value: membersLoading ? "..." : members.length.toString(), 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      title: "Events This Month", 
      value: eventsLoading ? "..." : upcomingEvents.length.toString(), 
      icon: Calendar, 
      color: "text-red-600", 
      bg: "bg-red-50" 
    },
    { 
      title: "Active Tasks", 
      value: tasksLoading ? "..." : activeTasks.length.toString(), 
      icon: CheckSquare, 
      color: "text-yellow-600", 
      bg: "bg-yellow-50" 
    },
    { 
      title: "Avg. Contribution", 
      value: membersLoading ? "..." : Math.round(members.reduce((sum, m) => sum + m.xp, 0) / Math.max(members.length, 1)).toString(), 
      icon: TrendingUp, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
  ];

  const recentEvents = events
    .sort((a, b) => b.date.seconds - a.date.seconds)
    .slice(0, 3)
    .map(event => ({
      title: event.title,
      date: new Date(event.date.seconds * 1000).toLocaleDateString(),
      attendees: event.assigned_members.length,
      status: event.status === 'completed' ? 'Completed' : 'Upcoming'
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your GDG chapter.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Quick Action
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.length > 0 ? recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date} • {event.attendees} attendees</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {event.status}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">No events found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContributors.length > 0 ? topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {contributor.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{contributor.name}</h4>
                    <p className="text-sm text-gray-600">{contributor.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{contributor.xp}</p>
                    <p className="text-xs text-gray-600">XP</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">No contributors found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
