import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bell, Bus, LogOut, Navigation } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [busRoute, setBusRoute] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profileData);

    if (profileData?.assigned_bus_number) {
      const { data: routeData } = await supabase
        .from('bus_routes')
        .select('*')
        .eq('bus_number', profileData.assigned_bus_number)
        .maybeSingle();

      setBusRoute(routeData);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name || 'Student'}!</h2>
          <p className="text-muted-foreground">Track your bus and stay updated</p>
        </div>

        {busRoute && (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary rounded-xl p-3">
                    <Bus className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{busRoute.bus_number}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Driver: {busRoute.driver_name || 'Not assigned'}
                    </p>
                  </div>
                </div>
                <Badge className={busRoute.status === 'active' ? 'bg-success' : 'bg-muted'}>
                  {busRoute.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/location">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow shadow-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Track Location</h3>
                    <p className="text-sm text-muted-foreground">
                      See real-time bus location on the map
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/alert">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow shadow-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-warning/10 rounded-full p-4">
                    <Bell className="w-8 h-8 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Alert Driver</h3>
                    <p className="text-sm text-muted-foreground">
                      Send an alert to your bus driver
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/nearby">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow shadow-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-secondary/10 rounded-full p-4">
                    <Navigation className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Nearby Buses</h3>
                    <p className="text-sm text-muted-foreground">
                      View all buses near your location
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
