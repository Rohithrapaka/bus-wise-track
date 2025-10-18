import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, LogOut, Play, Square, Route, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Map";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [busRoute, setBusRoute] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([20.5937, 78.9629]);
  const [alerts, setAlerts] = useState<any[]>([]);

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

    // Get bus assigned to this driver
    const { data: routeData } = await supabase
      .from('bus_routes')
      .select('*')
      .eq('driver_id', user.id)
      .maybeSingle();

    if (routeData) {
      setBusRoute(routeData);
      setIsActive(routeData.status === 'active');
      if (routeData.current_lat && routeData.current_lng) {
        setCurrentLocation([routeData.current_lat, routeData.current_lng]);
      }
    }

    // Load alerts for this driver
    const { data: alertsData } = await supabase
      .from('alerts')
      .select('*')
      .eq('driver_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (alertsData) {
      setAlerts(alertsData);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const toggleBusStatus = async () => {
    if (!busRoute) {
      toast({
        title: "No bus assigned",
        description: "Please contact admin to assign a bus",
        variant: "destructive",
      });
      return;
    }

    const newStatus = isActive ? 'inactive' : 'active';
    
    const { error } = await supabase
      .from('bus_routes')
      .update({ status: newStatus })
      .eq('id', busRoute.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update bus status",
        variant: "destructive",
      });
      return;
    }

    setIsActive(!isActive);
    toast({
      title: isActive ? "Bus stopped" : "Bus started",
      description: isActive ? "Route deactivated" : "Route activated",
    });
  };

  const updateLocation = async (lat: number, lng: number) => {
    if (!busRoute) return;

    const { error } = await supabase
      .from('bus_routes')
      .update({ 
        current_lat: lat,
        current_lng: lng 
      })
      .eq('id', busRoute.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
      return;
    }

    setCurrentLocation([lat, lng]);
    toast({
      title: "Location updated",
      description: "Bus location has been updated on the map",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">Driver Portal</h1>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name || 'Driver'}!</h2>
          <p className="text-muted-foreground">Manage your bus route</p>
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
                      Your assigned bus
                    </p>
                  </div>
                </div>
                <Badge className={isActive ? 'bg-success' : 'bg-muted'}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={toggleBusStatus}
                className="w-full"
                variant={isActive ? "destructive" : "default"}
              >
                {isActive ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Route
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Route
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-card mb-8">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle>Update Location</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Click on the map to update your bus location
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-lg overflow-hidden">
              <Map 
                center={currentLocation}
                zoom={12}
                markers={[{
                  position: currentLocation,
                  label: busRoute?.bus_number || 'Your Bus'
                }]}
                onLocationUpdate={updateLocation}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card mb-8">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              <CardTitle>Student Alerts</CardTitle>
            </div>
            <CardDescription>Messages from students</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No alerts received</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex justify-between items-start p-4 bg-muted rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge variant={alert.status === 'read' ? 'secondary' : 'default'} className="ml-3">
                      {alert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Route className="w-5 h-5 text-secondary" />
              <CardTitle>Route Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View detailed route information and scheduled stops
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DriverDashboard;
