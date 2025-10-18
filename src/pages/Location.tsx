import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bus, MapPin, Clock, Navigation, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Map from "@/components/Map";

const Location = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [busRoute, setBusRoute] = useState<any>(null);
  const [busStops, setBusStops] = useState<any[]>([]);
  const [nextStop, setNextStop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    loadBusData();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast({
            title: "Location access denied",
            description: "Enable location access to see your position",
            variant: "destructive",
          });
        }
      );
    }
  };

  const loadBusData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    // Get user profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profileData);

    if (profileData?.assigned_bus_number) {
      // Get bus route info
      const { data: routeData } = await supabase
        .from('bus_routes')
        .select('*')
        .eq('bus_number', profileData.assigned_bus_number)
        .single();

      setBusRoute(routeData);

      // Get bus stops
      const { data: stopsData } = await supabase
        .from('bus_stops')
        .select('*')
        .eq('bus_number', profileData.assigned_bus_number)
        .order('stop_order');

      setBusStops(stopsData || []);

      // Find next stop
      const next = stopsData?.find((stop: any) => stop.is_next_stop);
      setNextStop(next);
    }

    setLoading(false);
  };

  const refreshData = () => {
    toast({
      title: "Refreshing data...",
      description: "Fetching latest bus location",
    });
    loadBusData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading bus data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Live Tracking</h1>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative h-[60vh]">
        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-background shadow-lg"
          onClick={refreshData}
        >
          <RefreshCw className="w-5 h-5" />
        </Button>

        <Map 
          center={busRoute?.current_lat && busRoute?.current_lng ? [busRoute.current_lat, busRoute.current_lng] : userLocation || [20.5937, 78.9629]}
          zoom={13}
          markers={[
            ...(userLocation ? [{
              position: userLocation as [number, number],
              label: 'Your Location',
              color: '#10b981'
            }] : []),
            ...(busRoute?.current_lat && busRoute?.current_lng ? [{
              position: [busRoute.current_lat, busRoute.current_lng] as [number, number],
              label: busRoute.bus_number,
              color: '#3b82f6'
            }] : []),
            ...busStops.map((stop, index) => ({
              position: [stop.stop_lat, stop.stop_lng] as [number, number],
              label: `Stop ${index + 1}: ${stop.stop_name}`,
              color: stop.is_next_stop ? '#22c55e' : '#9ca3af'
            }))
          ]}
        />

        {/* Floating Bus Info Card */}
        <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto">
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary rounded-xl p-2">
                    <Bus className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{busRoute?.bus_number}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Driver: {busRoute?.driver_name || 'Not assigned'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">
                  {busRoute?.status === 'active' ? 'On Route' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Stop</p>
                    <p className="text-sm font-semibold">
                      {busStops[0]?.stop_name || 'Loading...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Next Stop</p>
                    <p className="text-sm font-semibold">
                      {nextStop?.stop_name || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="text-sm font-semibold">
                      {nextStop?.eta_minutes ? `${nextStop.eta_minutes} mins` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="text-sm font-semibold">2.3 km</p>
                  </div>
                </div>
              </div>
              <Link to="/alert">
                <Button variant="gradient" className="w-full">
                  Alert Driver
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bus Stops List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle>All Stops</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {busStops.length > 0 ? (
              <div className="space-y-3">
                {busStops.map((stop, index) => (
                  <div 
                    key={stop.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      stop.is_next_stop ? 'bg-success/10 border-success' : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        stop.is_next_stop ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{stop.stop_name}</p>
                        {stop.is_next_stop && (
                          <Badge className="bg-success text-success-foreground mt-1">Next Stop</Badge>
                        )}
                      </div>
                    </div>
                    {stop.eta_minutes && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">ETA</p>
                        <p className="font-semibold">{stop.eta_minutes} mins</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No stops available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Location;
