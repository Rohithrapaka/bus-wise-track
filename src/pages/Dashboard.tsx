import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import StudentDashboard from "./StudentDashboard";
import DriverDashboard from "./DriverDashboard";
import InchargeDashboard from "./InchargeDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { role, loading } = useUserRole();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (role === 'driver') {
    return <DriverDashboard />;
  }

  if (role === 'incharge') {
    return <InchargeDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;
