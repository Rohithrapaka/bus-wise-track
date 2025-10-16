import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, Star, Award, Bus } from "lucide-react";

const DriverDetails = () => {
  const driver = {
    name: "Michael Smith",
    busNumber: "Route 42",
    phone: "+1 (555) 123-4567",
    email: "michael.smith@bustrack.com",
    experience: "8 years",
    rating: 4.8,
    totalTrips: 1240,
    onTimeRate: "96%",
  };

  const instructor = {
    name: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    email: "sarah.johnson@bustrack.com",
    department: "Transportation",
    experience: "12 years",
    rating: 4.9,
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
            <h1 className="text-2xl font-bold text-foreground">Driver & Instructor Details</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Driver Profile */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Driver Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                      {driver.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground">{driver.name}</h3>
                    <p className="text-muted-foreground">{driver.busNumber}</p>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <Star className="w-5 h-5 fill-warning text-warning" />
                      <span className="font-semibold">{driver.rating}</span>
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{driver.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{driver.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Award className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Experience</p>
                          <p className="font-medium">{driver.experience}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Bus className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Trips</p>
                          <p className="font-medium">{driver.totalTrips}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">On-Time Rate</span>
                      <Badge className="bg-success text-success-foreground">{driver.onTimeRate}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Driver
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Profile */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Instructor Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-3xl">
                      {instructor.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground">{instructor.name}</h3>
                    <p className="text-muted-foreground">{instructor.department}</p>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <Star className="w-5 h-5 fill-warning text-warning" />
                      <span className="font-semibold">{instructor.rating}</span>
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{instructor.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{instructor.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Award className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Experience</p>
                          <p className="font-medium">{instructor.experience}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Instructor
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DriverDetails;
