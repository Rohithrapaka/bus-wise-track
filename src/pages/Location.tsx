import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bus, MapPin, Clock, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const Location = () => {
  const [busInfo] = useState({
    busNumber: "Route 42",
    currentStop: "Main Street",
    nextStop: "Park Avenue",
    eta: "8 mins",
    distance: "2.3 km",
    status: "On Route",
  });

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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <MapPin className="w-16 h-16 text-secondary mx-auto" />
            <p className="text-muted-foreground text-lg">Interactive map would display here</p>
            <p className="text-sm text-muted-foreground">Integration with Google Maps or similar service</p>
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
                    <CardTitle>{busInfo.busNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Driver: Michael Smith</p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">{busInfo.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Stop</p>
                    <p className="text-sm font-semibold">{busInfo.currentStop}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Next Stop</p>
                    <p className="text-sm font-semibold">{busInfo.nextStop}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="text-sm font-semibold">{busInfo.eta}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="text-sm font-semibold">{busInfo.distance}</p>
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
