
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Star } from "lucide-react";

export const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const members = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@university.edu",
      role: "Core Team",
      skills: ["Web Dev", "Cloud", "Leadership"],
      xp: 1250,
      eventsAttended: 8,
      tasksCompleted: 15,
      avatar: "SC"
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      email: "alex.r@university.edu",
      role: "Volunteer",
      skills: ["Android", "ML", "Design"],
      xp: 890,
      eventsAttended: 6,
      tasksCompleted: 12,
      avatar: "AR"
    },
    {
      id: 3,
      name: "Jordan Kim",
      email: "jordan.kim@university.edu",
      role: "Core Team",
      skills: ["Cloud", "DevOps", "Security"],
      xp: 760,
      eventsAttended: 5,
      tasksCompleted: 9,
      avatar: "JK"
    },
    {
      id: 4,
      name: "Maya Patel",
      email: "maya.p@university.edu",
      role: "Volunteer",
      skills: ["Web Dev", "UI/UX"],
      xp: 650,
      eventsAttended: 4,
      tasksCompleted: 8,
      avatar: "MP"
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Core Team":
        return "bg-blue-100 text-blue-800";
      case "Volunteer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">Manage your GDG chapter members and their contributions.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {filteredMembers.length} members
          </span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              <Badge className={getRoleColor(member.role)}>
                {member.role}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-yellow-50 rounded">
                    <p className="text-lg font-bold text-yellow-600">{member.xp}</p>
                    <p className="text-xs text-gray-600">XP</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-lg font-bold text-blue-600">{member.eventsAttended}</p>
                    <p className="text-xs text-gray-600">Events</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-600">{member.tasksCompleted}</p>
                    <p className="text-xs text-gray-600">Tasks</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
