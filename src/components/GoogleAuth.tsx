import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export const GoogleAuth = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, #4285F4 0%, #EA4335 25%, #FBBC05 50%, #34A853 100%)"
    }}>
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <img
            src="/icon.png"
            alt="GDG Logo"
            className="mx-auto mb-4 w-16 h-16 rounded-full shadow"
          />
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
  );
};
