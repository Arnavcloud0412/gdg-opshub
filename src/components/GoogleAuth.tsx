import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { GoogleDoodleBackground } from "@/components/GoogleDoodleBackground";

export const GoogleAuth = () => {
  const { signInWithGoogle, loading, signInAsDemoUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <GoogleDoodleBackground />
      <div className="flex flex-col items-center w-full">
        <Card className="w-full max-w-md shadow-2xl border-0 glass-card">
          <CardHeader className="text-center pb-2">
            <img src="/icon.png" alt="GDG Logo" className="mx-auto mb-4 w-16 h-16 rounded-full shadow-lg" />
            <CardTitle className="text-2xl font-bold text-gray-900">GDG OpsHub</CardTitle>
            <p className="text-gray-600 mt-2">Chapter Management Portal</p>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <Button 
              onClick={async () => {
                try {
                  setError(null);
                  await signInWithGoogle();
                } catch (error) {
                  setError(error instanceof Error ? error.message : 'An error occurred during sign in');
                }
              }}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Chrome className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => signInAsDemoUser()}
              disabled={loading}
            >
              Demo Login (Volunteer)
            </Button>
            <p className="text-xs text-center text-gray-400 mt-1">For demo purposes only. Grants volunteer access.</p>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Access your GDG chapter management dashboard
            </p>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                <strong>Note:</strong> Only @student.mes.ac.in and @mes.ac.in email addresses are allowed to access this portal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px) saturate(160%);
          box-shadow: 0 8px 32px 0 rgba(60,60,60,0.18), 0 1.5px 8px 0 rgba(66,133,244,0.08);
          border-radius: 1.25rem;
        }
      `}</style>
    </div>
  );
};
