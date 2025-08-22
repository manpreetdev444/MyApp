import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "../components/Navigation";
import { ObjectUploader } from "../components/ObjectUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Calendar, DollarSign, Inbox, Eye, Plus, Trash2, Edit } from "lucide-react";
import type { UploadResult } from '@uppy/core';

export default function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [response, setResponse] = useState('');

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'vendor')) {
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
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: inquiries } = useQuery({
    queryKey: ["/api/inquiries/received"],
    enabled: isAuthenticated && user?.role === 'vendor',
  });

  const { data: portfolio } = useQuery({
    queryKey: ["/api/vendor/portfolio"],
    enabled: isAuthenticated && user?.role === 'vendor',
  });

  const { data: packages } = useQuery({
    queryKey: ["/api/vendor/packages"],
    enabled: isAuthenticated && user?.role === 'vendor',
  });

  const respondToInquiryMutation = useMutation({
    mutationFn: async ({ inquiryId, response, status }: { inquiryId: string; response: string; status: string }) => {
      return apiRequest('PUT', `/api/inquiries/${inquiryId}/respond`, { response, status });
    },
    onSuccess: () => {
      toast({
        title: "Response Sent",
        description: "Your response has been sent to the couple.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries/received"] });
      setSelectedInquiry(null);
      setResponse('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/objects/upload');
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful.length > 0) {
      const file = result.successful[0];
      const uploadURL = file.uploadURL;
      
      // Call API to set ACL and create portfolio item
      apiRequest('PUT', '/api/portfolio-images', {
        imageURL: uploadURL,
        title: file.name,
        description: '',
      }).then(() => {
        toast({
          title: "Image Uploaded",
          description: "Your portfolio image has been uploaded successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/vendor/portfolio"] });
      }).catch(() => {
        toast({
          title: "Error",
          description: "Failed to process uploaded image.",
          variant: "destructive",
        });
      });
    }
  };

  const handleRespondToInquiry = (inquiry: any, status: string) => {
    respondToInquiryMutation.mutate({
      inquiryId: inquiry.id,
      response,
      status,
    });
  };

  // Get inquiry stats
  const newInquiries = inquiries?.filter((inquiry: any) => inquiry.status === 'pending').length || 0;
  const confirmedBookings = inquiries?.filter((inquiry: any) => inquiry.status === 'accepted').length || 0;
  const monthlyRevenue = confirmedBookings * 2500; // Mock calculation
  const profileViews = 247; // Mock data

  const upcomingEvents = [
    {
      id: 1,
      coupleName: "Sarah & Michael's Wedding",
      venue: "Rosewood Gardens",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: "2:00 PM - 10:00 PM",
      status: "Confirmed"
    },
    {
      id: 2,
      coupleName: "Lisa & James Engagement",
      venue: "Golden Gate Park",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      time: "5:00 PM - 7:00 PM",
      status: "Scheduled"
    }
  ];

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

      {/* Vendor Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-charcoal mb-2">
            Welcome back, {user?.roleData?.businessName || 'Vendor'}!
          </h1>
          <p className="text-charcoal/70">Manage your business and connect with couples planning their perfect day.</p>
        </div>

        {/* Vendor Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-new-inquiries">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal/60">New Inquiries</p>
                  <p className="text-3xl font-bold text-rose-gold">{newInquiries}</p>
                </div>
                <div className="bg-rose-gold/20 rounded-full p-3">
                  <Inbox className="w-5 h-5 text-rose-gold" />
                </div>
              </div>
              <p className="text-sm text-sage mt-2">+2 from last week</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-confirmed-bookings">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal/60">Confirmed Bookings</p>
                  <p className="text-3xl font-bold text-sage">{confirmedBookings}</p>
                </div>
                <div className="bg-sage/20 rounded-full p-3">
                  <Calendar className="w-5 h-5 text-sage" />
                </div>
              </div>
              <p className="text-sm text-sage mt-2">+3 this month</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-monthly-revenue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal/60">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-dusty-blue">${monthlyRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-dusty-blue/20 rounded-full p-3">
                  <DollarSign className="w-5 h-5 text-dusty-blue" />
                </div>
              </div>
              <p className="text-sm text-sage mt-2">+15% from last month</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-profile-views">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal/60">Profile Views</p>
                  <p className="text-3xl font-bold text-champagne">{profileViews}</p>
                </div>
                <div className="bg-champagne/20 rounded-full p-3">
                  <Eye className="w-5 h-5 text-champagne" />
                </div>
              </div>
              <p className="text-sm text-sage mt-2">+8% this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Inquiries & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Inquiries */}
          <Card data-testid="card-recent-inquiries">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Inquiries</span>
                <Button variant="ghost" size="sm" className="text-rose-gold hover:text-rose-gold/80">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inquiries && inquiries.length > 0 ? (
                  inquiries.slice(0, 3).map((inquiry: any, index: number) => (
                    <div key={inquiry.id} className="border border-blush rounded-lg p-4 hover:shadow-sm transition-shadow" data-testid={`inquiry-${index}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-charcoal" data-testid={`inquiry-couple-${index}`}>
                            Couple Inquiry
                          </h4>
                          <p className="text-sm text-charcoal/60" data-testid={`inquiry-date-${index}`}>
                            {inquiry.eventDate ? `Event: ${new Date(inquiry.eventDate).toLocaleDateString()}` : 'No event date'}
                          </p>
                        </div>
                        <Badge 
                          variant={inquiry.status === 'pending' ? 'secondary' : 'default'}
                          data-testid={`inquiry-status-${index}`}
                        >
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-charcoal/70 mb-3" data-testid={`inquiry-message-${index}`}>
                        {inquiry.message.length > 100 ? inquiry.message.substring(0, 100) + '...' : inquiry.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-charcoal/60">
                          Budget: <span className="font-medium text-sage" data-testid={`inquiry-budget-${index}`}>
                            {inquiry.budget ? `$${parseFloat(inquiry.budget).toLocaleString()}` : 'Not specified'}
                          </span>
                        </span>
                        <div className="flex space-x-2">
                          {inquiry.status === 'pending' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  className="bg-sage text-white hover:bg-sage/90"
                                  onClick={() => setSelectedInquiry(inquiry)}
                                  data-testid={`button-respond-${index}`}
                                >
                                  Respond
                                </Button>
                              </DialogTrigger>
                              <DialogContent data-testid="dialog-respond-inquiry">
                                <DialogHeader>
                                  <DialogTitle>Respond to Inquiry</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Original Message:</h4>
                                    <p className="text-sm text-charcoal/70 bg-gray-50 p-3 rounded">
                                      {selectedInquiry?.message}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Your Response:</label>
                                    <Textarea
                                      value={response}
                                      onChange={(e) => setResponse(e.target.value)}
                                      placeholder="Write your response to the couple..."
                                      rows={4}
                                      data-testid="textarea-response"
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      onClick={() => handleRespondToInquiry(selectedInquiry, 'responded')}
                                      disabled={!response.trim() || respondToInquiryMutation.isPending}
                                      className="bg-sage text-white hover:bg-sage/90"
                                      data-testid="button-send-response"
                                    >
                                      Send Response
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleRespondToInquiry(selectedInquiry, 'declined')}
                                      disabled={respondToInquiryMutation.isPending}
                                      data-testid="button-decline-inquiry"
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-charcoal/60" data-testid="text-no-inquiries">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
                    <p>No inquiries yet</p>
                    <p className="text-sm">Inquiries from couples will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calendar & Upcoming Events */}
          <Card data-testid="card-upcoming-events">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upcoming Events</span>
                <Button variant="ghost" size="sm" className="text-rose-gold hover:text-rose-gold/80">
                  Manage Calendar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4 p-3 bg-blush/30 rounded-lg" data-testid={`event-${index}`}>
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-charcoal/60" data-testid={`event-month-${index}`}>
                        {event.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-2xl font-bold text-charcoal" data-testid={`event-day-${index}`}>
                        {event.date.getDate()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-charcoal" data-testid={`event-name-${index}`}>
                        {event.coupleName}
                      </h4>
                      <p className="text-sm text-charcoal/60" data-testid={`event-venue-${index}`}>
                        {event.venue}
                      </p>
                      <p className="text-sm text-charcoal/70" data-testid={`event-time-${index}`}>
                        {event.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant={event.status === 'Confirmed' ? 'default' : 'secondary'} data-testid={`event-status-${index}`}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-4 bg-rose-gold text-white hover:bg-rose-gold/90"
                data-testid="button-manage-availability"
              >
                Block/Unblock Dates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Management */}
        <Card className="mt-8" data-testid="card-portfolio-management">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Portfolio Management</span>
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={10485760}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="bg-rose-gold text-white hover:bg-rose-gold/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Photos
              </ObjectUploader>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {portfolio && portfolio.length > 0 ? (
                portfolio.map((item: any, index: number) => (
                  <div key={item.id} className="relative group cursor-pointer" data-testid={`portfolio-item-${index}`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title || "Portfolio image"} 
                      className="w-full h-32 object-cover rounded-lg"
                      data-testid={`portfolio-image-${index}`}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-white hover:text-rose-gold mr-2"
                          data-testid={`button-edit-${index}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-white hover:text-red-400"
                          data-testid={`button-delete-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-charcoal/60" data-testid="text-no-portfolio">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
                  <p>No portfolio images yet</p>
                  <p className="text-sm">Upload photos to showcase your work</p>
                </div>
              )}
              
              {/* Add more photos placeholder */}
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={10485760}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="border-2 border-dashed border-blush rounded-lg h-32 w-full flex items-center justify-center cursor-pointer hover:border-rose-gold transition-colors bg-transparent"
              >
                <div className="text-center">
                  <Plus className="w-6 h-6 text-charcoal/40 mb-2 mx-auto" />
                  <p className="text-sm text-charcoal/60">Add Photo</p>
                </div>
              </ObjectUploader>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
