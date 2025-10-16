import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Bell, Users, Clock, Menu, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [busInfo, setBusInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setProfile(profileData);

    // Fetch bus info if user has assigned bus
    if (profileData.assigned_bus_number) {
      const { data: busData } = await supabase
        .from('bus_routes')
        .select('*')
        .eq('bus_number', profileData.assigned_bus_number)
        .single();

      if (busData) {
        setBusInfo(busData);
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const busStatus = {
    routeNumber: profile?.assigned_bus_number || "No bus assigned",
    status: busInfo?.status === 'active' ? "On Route" : "Inactive",
    eta: "8 mins",
    nextStop: "Park Avenue",
    distance: "2.3 km",
  };

  const quickActions = [
    {
      title: "Track Location",
      description: "See bus location in real-time",
      icon: MapPin,
      link: "/location",
      gradient: "from-secondary to-secondary/80",
    },
    {
      title: "Alert Driver",
      description: "Send quick message to driver",
      icon: Bell,
      link: "/alert",
      gradient: "from-warning to-warning/80",
    },
    {
      title: "Bus Details",
      description: "View route and schedule",
      icon: Bus,
      link: "/bus-details",
      gradient: "from-primary to-warning",
    },
    {
      title: "Nearby Buses",
      description: "Find buses near you",
      icon: Users,
      link: "/nearby",
      gradient: "from-success to-success/80",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Route":
        return "bg-success text-success-foreground";
      case "Arrived":
        return "bg-secondary text-secondary-foreground";
      case "Missed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-xl p-2">
                <Bus className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">BusTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
            </h2>
            <p className="text-muted-foreground">Here's your bus status for today</p>
          </div>

          {/* Bus Status Card */}
          <Card className="shadow-card border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{busStatus.routeNumber}</CardTitle>
                  <CardDescription className="text-base mt-1">Next Stop: {busStatus.nextStop}</CardDescription>
                </div>
                <Badge className={getStatusColor(busStatus.status)}>{busStatus.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Time</p>
                    <p className="text-lg font-semibold">{busStatus.eta}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="text-lg font-semibold">{busStatus.distance}</p>
                  </div>
                </div>
              </div>
              {profile?.assigned_bus_number && (
                <Link to="/location">
                  <Button variant="gradient" className="w-full">
                    Track My Bus
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.link}>
                  <Card className="shadow-card hover:shadow-elevated transition-all cursor-pointer group h-full">
                    <CardContent className="pt-6">
                      <div className={`bg-gradient-to-br ${action.gradient} rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h3>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { time: "8:30 AM", message: "Bus arrived at Main Street", type: "success" },
                    { time: "8:15 AM", message: "Bus departed from College Campus", type: "info" },
                    { time: "8:00 AM", message: "Route started", type: "info" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === "success" ? "bg-success" : "bg-secondary"}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
