
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CheckSquare, TrendingUp, Plus, Award } from "lucide-react";

export const Dashboard = () => {
  const stats = [
    { title: "Total Members", value: "47", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Events This Month", value: "5", icon: Calendar, color: "text-red-600", bg: "bg-red-50" },
    { title: "Active Tasks", value: "12", icon: CheckSquare, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "Avg. Contribution", value: "85", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  ];

  const recentEvents = [
    { title: "Google Cloud Workshop", date: "Dec 15", attendees: 25, status: "Completed" },
    { title: "Android Dev Meetup", date: "Dec 20", attendees: 18, status: "Upcoming" },
    { title: "AI/ML Study Jam", date: "Dec 22", attendees: 32, status: "Upcoming" },
  ];

  const topContributors = [
    { name: "Sarah Chen", role: "Core Team", xp: 1250, avatar: "SC" },
    { name: "Alex Rodriguez", role: "Volunteer", xp: 890, avatar: "AR" },
    { name: "Jordan Kim", role: "Core Team", xp: 760, avatar: "JK" },
  ];

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
              {recentEvents.map((event, index) => (
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
              ))}
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
              {topContributors.map((contributor, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
