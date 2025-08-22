import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Heart, Calendar, Users } from "lucide-react";
import { Link } from "wouter";

export default function IndividualDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-warm-gray">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-charcoal">
                Welcome, {user?.roleData?.fullName || user?.firstName || "there"}! 👋
              </h1>
              <p className="text-charcoal/70">Ready to find the perfect vendors for your event?</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/logout'}
              variant="outline"
              className="text-charcoal hover:bg-blush/50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-rose-gold/20 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal">Browse Vendors</CardTitle>
              <Search className="h-4 w-4 text-rose-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">Find</div>
              <p className="text-xs text-charcoal/70">
                Discover amazing vendors for your event
              </p>
            </CardContent>
          </Card>

          <Card className="border-dusty-blue/20 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal">Saved Vendors</CardTitle>
              <Heart className="h-4 w-4 text-dusty-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">0</div>
              <p className="text-xs text-charcoal/70">
                Vendors you've favorited
              </p>
            </CardContent>
          </Card>

          <Card className="border-sage/20 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal">Inquiries</CardTitle>
              <Calendar className="h-4 w-4 text-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">0</div>
              <p className="text-xs text-charcoal/70">
                Messages sent to vendors
              </p>
            </CardContent>
          </Card>

          <Card className="border-champagne/20 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal">Event Planning</CardTitle>
              <Users className="h-4 w-4 text-champagne" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">Ready</div>
              <p className="text-xs text-charcoal/70">
                Start planning your event
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-charcoal">Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-charcoal/70 mb-6">
                  Welcome to WedSimplify! Here are some quick actions to help you find the perfect vendors for your event:
                </p>
                
                <div className="space-y-4">
                  <Link to="/vendors">
                    <Button className="w-full bg-rose-gold hover:bg-rose-gold/90 text-white justify-start" data-testid="button-browse-vendors">
                      <Search className="mr-2 h-4 w-4" />
                      Browse All Vendors
                    </Button>
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/vendors?category=photography">
                      <Button variant="outline" className="w-full justify-start border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10">
                        📸 Photography
                      </Button>
                    </Link>
                    <Link to="/vendors?category=catering">
                      <Button variant="outline" className="w-full justify-start border-sage text-sage hover:bg-sage/10">
                        🍽️ Catering
                      </Button>
                    </Link>
                    <Link to="/vendors?category=venue">
                      <Button variant="outline" className="w-full justify-start border-champagne text-champagne hover:bg-champagne/10">
                        🏛️ Venues
                      </Button>
                    </Link>
                    <Link to="/vendors?category=music">
                      <Button variant="outline" className="w-full justify-start border-rose-gold text-rose-gold hover:bg-rose-gold/10">
                        🎵 Music & DJ
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-charcoal">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-rose-gold rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-charcoal text-sm">Start Early</h4>
                      <p className="text-xs text-charcoal/60">Popular vendors book up months in advance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-dusty-blue rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-charcoal text-sm">Set a Budget</h4>
                      <p className="text-xs text-charcoal/60">Know your spending limits before reaching out</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-sage rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-charcoal text-sm">Ask Questions</h4>
                      <p className="text-xs text-charcoal/60">Don't hesitate to inquire about packages and availability</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-champagne rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-charcoal text-sm">Read Reviews</h4>
                      <p className="text-xs text-charcoal/60">Check ratings and reviews from other clients</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}