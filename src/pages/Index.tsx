
import { useState } from "react";
import { GoogleAuth } from "@/components/GoogleAuth";
import { Dashboard } from "@/components/Dashboard";
import { EventsPage } from "@/components/EventsPage";
import { MembersPage } from "@/components/MembersPage";
import { TasksPage } from "@/components/TasksPage";
import { AIDocsPage } from "@/components/AIDocsPage";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, userData, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">GDG</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return <GoogleAuth />;
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
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} userData={userData} />
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
