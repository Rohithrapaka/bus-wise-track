import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bell, Bus, LogOut, Navigation, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const InchargeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [buses, setBuses] = useState<any[]>([]);

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

    // Get all buses
    const { data: busesData } = await supabase
      .from('bus_routes')
      .select('*')
      .order('bus_number');

    setBuses(busesData || []);
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
            <h1 className="text-2xl font-bold text-foreground">Incharge Portal</h1>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name || 'Incharge'}!</h2>
          <p className="text-muted-foreground">Monitor and manage all buses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/location">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow shadow-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Track Buses</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor all bus locations
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
                    <h3 className="font-semibold text-lg mb-2">Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      View and manage alerts
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
                      View all nearby buses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-success/10 rounded-full p-4">
                  <Settings className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Manage Buses</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure bus routes and drivers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Active Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buses.map((bus) => (
                <div key={bus.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary rounded-lg p-2">
                      <Bus className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{bus.bus_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Driver: {bus.driver_name || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                  <Badge className={bus.status === 'active' ? 'bg-success' : 'bg-muted'}>
                    {bus.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
              {buses.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No buses available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InchargeDashboard;
