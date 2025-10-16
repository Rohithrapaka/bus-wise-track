import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Alert = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const quickReasons = [
    "Running late",
    "Missed the bus",
    "At wrong stop",
    "Emergency",
  ];

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Alert Sent Successfully!",
      description: "The driver has been notified of your message.",
    });
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
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
            <h1 className="text-2xl font-bold text-foreground">Alert Driver</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Info Card */}
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Quick Alert</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Send a quick message to your bus driver. They will receive it immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Send Alert to Driver</CardTitle>
              <CardDescription>Choose a quick reason or write a custom message</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendAlert} className="space-y-6">
                {/* Quick Reasons */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Quick Reasons</label>
                  <div className="grid grid-cols-2 gap-3">
                    {quickReasons.map((reason) => (
                      <Button
                        key={reason}
                        type="button"
                        variant={selectedReason === reason ? "default" : "outline"}
                        onClick={() => {
                          setSelectedReason(reason);
                          setMessage(reason);
                        }}
                        className="justify-start"
                      >
                        {reason}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Message */}
                <div className="space-y-3">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Custom Message (Optional)
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {/* Driver Info */}
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Sending to:</p>
                  <p className="text-sm text-muted-foreground">Michael Smith - Route 42</p>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={!message}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Alert
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Your previous messages to drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Today, 8:30 AM", message: "Running 5 minutes late", status: "Delivered" },
                  { date: "Yesterday, 8:25 AM", message: "Missed the bus", status: "Read" },
                ].map((alert, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">{alert.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Alert;
