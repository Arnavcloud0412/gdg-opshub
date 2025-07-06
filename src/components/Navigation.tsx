import { Button } from "@/components/ui/button";
import { Users, Calendar, CheckSquare, FileText, BarChart3, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userData: any;
}

export const Navigation = ({ currentPage, onPageChange, userData }: NavigationProps) => {
  const { logout } = useAuth();
  
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "events", label: "Events", icon: Calendar },
    { id: "members", label: "Members", icon: Users },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "ai-docs", label: "AI Docs", icon: FileText },
  ];

  return (
    <nav className="bg-transparent backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/icon.png"
              alt="GDG Logo"
              className="w-10 h-10 rounded-lg shadow"
            />
            <h1 className="text-xl font-bold text-gray-900">OpsHub</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 ${
                    currentPage === item.id 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src={userData?.profile_photo} 
                alt={userData?.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700 hidden md:inline">
                {userData?.name}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
