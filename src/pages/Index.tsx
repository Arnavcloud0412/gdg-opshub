
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CheckSquare, FileText, TrendingUp, Star } from "lucide-react";
import { GoogleAuth } from "@/components/GoogleAuth";
import { Dashboard } from "@/components/Dashboard";
import { EventsPage } from "@/components/EventsPage";
import { MembersPage } from "@/components/MembersPage";
import { TasksPage } from "@/components/TasksPage";
import { AIDocsPage } from "@/components/AIDocsPage";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!isAuthenticated) {
    return <GoogleAuth onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "events":
        return <EventsPage />;
      case "members":
        return <MembersPage />;
      case "tasks":
        return <TasksPage />;
      case "ai-docs":
        return <AIDocsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
