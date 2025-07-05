
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const GoogleAuth = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">GDG</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">GDG OpsHub</CardTitle>
          <p className="text-gray-600 mt-2">Chapter Management Portal</p>
        </CardHeader>
        <CardContent className="pt-6">
          <Button 
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Chrome className="w-5 h-5" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Access your GDG chapter management dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
