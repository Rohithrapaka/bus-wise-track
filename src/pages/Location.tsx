import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bus, MapPin, Clock, Navigation, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Location = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [busRoute, setBusRoute] = useState<any>(null);
  const [busStops, setBusStops] = useState<any[]>([]);
  const [nextStop, setNextStop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusData();
  }, []);

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
      <div className="relative h-[60vh] bg-muted">
        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-background shadow-lg"
          onClick={refreshData}
        >
          <RefreshCw className="w-5 h-5" />
        </Button>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              {/* User location - blue dot */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg" />
                <p className="text-xs mt-1 text-muted-foreground">You</p>
              </div>

              {/* Bus icon with number */}
              <div className="bg-primary rounded-xl p-4 shadow-xl inline-block animate-bounce">
                <Bus className="w-12 h-12 text-primary-foreground" />
                <span className="absolute -top-2 -right-2 bg-warning text-warning-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
                  {busRoute?.bus_number?.split(' ')[1] || '21'}
                </span>
              </div>

              {/* Route stops */}
              <div className="flex justify-center space-x-8 mt-12">
                {busStops.slice(0, 3).map((stop, index) => (
                  <div key={stop.id} className="text-center">
                    <div className={`w-6 h-6 rounded-full ${
                      stop.is_next_stop 
                        ? 'bg-success scale-125' 
                        : 'bg-muted-foreground/30'
                    } mx-auto shadow-md`} />
                    <p className={`text-xs mt-2 ${
                      stop.is_next_stop ? 'font-bold text-success' : 'text-muted-foreground'
                    }`}>
                      {stop.stop_name}
                    </p>
                    {stop.is_next_stop && (
                      <p className="text-xs text-success font-semibold mt-1">
                        ETA: {stop.eta_minutes} min
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mt-8">
              Live tracking simulation • Map integration ready
            </p>
          </div>
        </div>

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

      {/* Bottom Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-secondary/10 rounded-lg p-2">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold">Schedule</h3>
              </div>
              <p className="text-sm text-muted-foreground">View full route schedule and timings</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-primary/10 rounded-lg p-2">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">All Stops</h3>
              </div>
              <p className="text-sm text-muted-foreground">See all stops along this route</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-success/10 rounded-lg p-2">
                  <Bus className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-semibold">Bus Details</h3>
              </div>
              <p className="text-sm text-muted-foreground">Driver info and bus specifications</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Location;
