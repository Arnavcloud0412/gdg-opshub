import { useState } from "react";
import { GoogleAuth } from "@/components/GoogleAuth";
import { Dashboard } from "@/components/Dashboard";
import { EventsPage } from "@/components/EventsPage";
import { MembersPage } from "@/components/MembersPage";
import { TasksPage } from "@/components/TasksPage";
import { AIDocsPage } from "@/components/AIDocsPage";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { ChatbotWidget } from "@/chatbot";

const Index = () => {
  const { user, userData, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img
            src="/icon.png"
            alt="GDG Logo"
            className="mx-auto mb-4 w-16 h-16 rounded-full shadow"
          />
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
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, #4285F4 0%, #EA4335 25%, #FBBC05 50%, #34A853 100%)"
    }}>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} userData={userData} />
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>
      
      {/* Chatbot Widget - Only show for authenticated users */}
      {user && userData && (
        <ChatbotWidget 
          isOpen={isChatOpen} 
          onToggle={() => setIsChatOpen(!isChatOpen)}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Index;
