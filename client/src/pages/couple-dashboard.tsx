import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "../components/Navigation";
import VendorCard from "../components/VendorCard";
import BudgetTracker from "../components/BudgetTracker";
import WeddingTimeline from "../components/WeddingTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Users, MessageSquare, Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CoupleDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ["/api/vendors"],
    enabled: isAuthenticated,
  });

  const { data: inquiries } = useQuery({
    queryKey: ["/api/inquiries/sent"],
    enabled: isAuthenticated,
  });

  const { data: budgetItems } = useQuery({
    queryKey: ["/api/budget"],
    enabled: isAuthenticated,
  });

  const { data: timelineItems } = useQuery({
    queryKey: ["/api/timeline"],
    enabled: isAuthenticated,
  });

  // Calculate budget progress
  const totalBudget = user?.roleData?.budget ? parseFloat(user.roleData.budget) : 25000;
  const spentAmount = budgetItems ? budgetItems.reduce((sum: number, item: any) => 
    sum + (item.actualCost ? parseFloat(item.actualCost) : 0), 0) : 0;
  const budgetProgress = (spentAmount / totalBudget) * 100;

  // Calculate vendor progress
  const bookedVendors = inquiries?.filter((inquiry: any) => inquiry.status === 'accepted').length || 0;
  const neededVendors = 8; // Typical wedding vendor categories
  const vendorProgress = (bookedVendors / neededVendors) * 100;

  // Calculate days remaining
  const weddingDate = user?.roleData?.weddingDate ? new Date(user.roleData.weddingDate) : new Date();
  const today = new Date();
  const daysRemaining = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Get upcoming timeline items
  const upcomingItems = timelineItems?.filter((item: any) => 
    !item.isCompleted && new Date(item.dueDate) > today
  ).slice(0, 3) || [];

  // Get recent inquiries
  const recentInquiries = inquiries?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="animate-spin w-8 h-8 border-4 border-rose-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-rose-gold to-dusty-blue overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/20 to-dusty-blue/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4">
              Your Dream Wedding 
              <span className="text-champagne"> Simplified</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Find the perfect vendors for your special day. Browse portfolios, compare packages, and book with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/vendors">
                <Button className="bg-champagne text-charcoal hover:bg-champagne/90 px-8 py-4" data-testid="button-find-vendors">
                  Find Vendors
                </Button>
              </Link>
              <Button variant="outline" className="bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30 px-8 py-4" data-testid="button-view-timeline">
                View Timeline
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div data-testid="stat-vendors">
                <div className="text-2xl font-bold text-rose-gold">1,200+</div>
                <div className="text-sm text-charcoal/70">Trusted Vendors</div>
              </div>
              <div data-testid="stat-weddings">
                <div className="text-2xl font-bold text-sage">5,000+</div>
                <div className="text-sm text-charcoal/70">Weddings Planned</div>
              </div>
              <div data-testid="stat-savings">
                <div className="text-2xl font-bold text-dusty-blue">$3,500</div>
                <div className="text-sm text-charcoal/70">Average Savings</div>
              </div>
              <div data-testid="stat-satisfaction">
                <div className="text-2xl font-bold text-champagne">98%</div>
                <div className="text-sm text-charcoal/70">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Wedding Progress Overview */}
        <Card className="border-blush shadow-sm mb-8" data-testid="card-wedding-progress">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-playfair font-semibold text-charcoal">Your Wedding Progress</h2>
              <span className="text-sm text-charcoal/60" data-testid="text-wedding-date">
                {user?.roleData?.weddingDate ? 
                  new Date(user.roleData.weddingDate).toLocaleDateString() : 
                  'Wedding Date Not Set'
                }
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Budget Progress */}
              <div className="bg-gradient-to-br from-rose-gold/10 to-rose-gold/5 rounded-lg p-4" data-testid="card-budget-progress">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-charcoal">Budget</h3>
                  <DollarSign className="w-5 h-5 text-rose-gold" />
                </div>
                <div className="text-2xl font-bold text-charcoal mb-2" data-testid="text-spent-amount">
                  ${spentAmount.toLocaleString()}
                </div>
                <div className="text-sm text-charcoal/70 mb-3">
                  of <span data-testid="text-total-budget">${totalBudget.toLocaleString()}</span> total
                </div>
                <Progress value={budgetProgress} className="h-2" />
              </div>

              {/* Vendors Booked */}
              <div className="bg-gradient-to-br from-sage/10 to-sage/5 rounded-lg p-4" data-testid="card-vendor-progress">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-charcoal">Vendors</h3>
                  <Users className="w-5 h-5 text-sage" />
                </div>
                <div className="text-2xl font-bold text-charcoal mb-2" data-testid="text-booked-vendors">
                  {bookedVendors}
                </div>
                <div className="text-sm text-charcoal/70 mb-3">
                  of <span data-testid="text-needed-vendors">{neededVendors}</span> needed
                </div>
                <Progress value={vendorProgress} className="h-2" />
              </div>

              {/* Days Remaining */}
              <div className="bg-gradient-to-br from-dusty-blue/10 to-dusty-blue/5 rounded-lg p-4" data-testid="card-timeline-progress">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-charcoal">Timeline</h3>
                  <Calendar className="w-5 h-5 text-dusty-blue" />
                </div>
                <div className="text-2xl font-bold text-charcoal mb-2" data-testid="text-days-remaining">
                  {daysRemaining > 0 ? daysRemaining : 0}
                </div>
                <div className="text-sm text-charcoal/70">days remaining</div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mt-2 text-dusty-blue hover:text-dusty-blue/80 p-0"
                  data-testid="button-view-timeline-details"
                >
                  View Timeline →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Recommended Vendors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="border-blush shadow-sm" data-testid="card-recent-activity">
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-4">Recent Activity</h3>
                
                <div className="space-y-4">
                  {recentInquiries.length > 0 ? (
                    recentInquiries.map((inquiry: any, index: number) => (
                      <div key={inquiry.id} className="flex items-start space-x-3" data-testid={`activity-inquiry-${index}`}>
                        <div className="flex-shrink-0 w-8 h-8 bg-rose-gold/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-rose-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-charcoal">
                            Inquiry sent to vendor
                          </p>
                          <p className="text-xs text-charcoal/60">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={inquiry.status === 'pending' ? 'secondary' : 'default'}>
                          {inquiry.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-charcoal/60" data-testid="text-no-activity">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
                      <p>No recent activity</p>
                      <p className="text-sm">Start contacting vendors to see updates here</p>
                    </div>
                  )}
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-rose-gold hover:text-rose-gold/80"
                  data-testid="button-view-all-activity"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Vendors */}
          <div className="lg:col-span-2">
            <Card className="border-blush shadow-sm" data-testid="card-recommended-vendors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-playfair font-semibold">Recommended for You</h3>
                  <Link href="/vendors">
                    <Button variant="ghost" className="text-rose-gold hover:text-rose-gold/80" data-testid="button-view-all-vendors">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {vendorsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="border border-blush rounded-lg p-4 animate-pulse" data-testid={`vendor-skeleton-${i}`}>
                        <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : vendors && vendors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendors.slice(0, 4).map((vendor: any, index: number) => (
                      <VendorCard 
                        key={vendor.id} 
                        vendor={vendor} 
                        data-testid={`vendor-card-${index}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-charcoal/60" data-testid="text-no-vendors">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
                    <p>No vendors available</p>
                    <p className="text-sm">Check back later for vendor recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wedding Timeline Preview */}
        <Card className="border-blush shadow-sm mt-8" data-testid="card-timeline-preview">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-playfair font-semibold">Your Wedding Timeline</h3>
              <Button 
                className="bg-rose-gold text-white hover:bg-rose-gold/90"
                data-testid="button-view-full-timeline"
              >
                View Full Timeline
              </Button>
            </div>

            {upcomingItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingItems.map((item: any, index: number) => (
                  <div key={item.id} className="relative" data-testid={`timeline-item-${index}`}>
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5 text-sage" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal" data-testid={`timeline-title-${index}`}>
                          {item.title}
                        </h4>
                        <p className="text-sm text-charcoal/60" data-testid={`timeline-date-${index}`}>
                          {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No date set'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-charcoal/70 ml-13" data-testid={`timeline-description-${index}`}>
                      {item.description || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-charcoal/60" data-testid="text-no-timeline-items">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
                <p>No upcoming timeline items</p>
                <p className="text-sm">Add items to your wedding timeline to track progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
