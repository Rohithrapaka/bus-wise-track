import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bus, MapPin, Clock, Navigation, Search } from "lucide-react";

const Nearby = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const nearbyBuses = [
    {
      route: "Route 42",
      distance: "0.5 km",
      direction: "North",
      eta: "3 mins",
      status: "Approaching",
      nextStop: "Main Street",
    },
    {
      route: "Route 15",
      distance: "1.2 km",
      direction: "East",
      eta: "8 mins",
      status: "On Route",
      nextStop: "Park Avenue",
    },
    {
      route: "Route 28",
      distance: "2.1 km",
      direction: "West",
      eta: "12 mins",
      status: "On Route",
      nextStop: "College Campus",
    },
    {
      route: "Route 7",
      distance: "3.5 km",
      direction: "South",
      eta: "18 mins",
      status: "Delayed",
      nextStop: "Shopping Mall",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approaching":
        return "bg-success text-success-foreground";
      case "On Route":
        return "bg-secondary text-secondary-foreground";
      case "Delayed":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">Nearby Buses</h1>
          </div>
        </div>
      </header>

      {/* Map Preview */}
      <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 text-secondary mx-auto" />
            <p className="text-muted-foreground">Map showing nearby buses</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by route number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filters</Button>
          </div>

          {/* Nearby Buses List */}
          <div className="space-y-4">
            {nearbyBuses
              .filter((bus) => bus.route.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((bus, index) => (
                <Card key={index} className="shadow-card hover:shadow-elevated transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Bus Info */}
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary rounded-xl p-3">
                          <Bus className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-foreground">{bus.route}</h3>
                            <Badge className={getStatusColor(bus.status)}>{bus.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>Next: {bus.nextStop}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Navigation className="w-4 h-4" />
                              <span>{bus.direction}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Distance and ETA */}
                      <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-secondary" />
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Distance</p>
                            <p className="text-lg font-semibold">{bus.distance}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-primary" />
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">ETA</p>
                            <p className="text-lg font-semibold">{bus.eta}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                      <Button variant="secondary" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Track Live
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Empty State */}
          {nearbyBuses.filter((bus) => bus.route.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="text-center py-8 space-y-2">
                  <Bus className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">No buses found matching your search</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Nearby;
