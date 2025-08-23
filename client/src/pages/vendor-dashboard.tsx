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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Bell, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Inbox, 
  Eye, 
  Plus, 
  Trash2, 
  Edit,
  MessageSquare,
  CheckCircle,
  X,
  Save,
  Camera,
  Globe,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import type { UploadResult } from '@uppy/core';

export default function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [vendorProfile, setVendorProfile] = useState({
    businessName: '',
    category: '',
    description: '',
    location: '',
    phone: '',
    website: '',
    instagram: '',
    pinterest: ''
  });

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

  // Load vendor profile data when user is available
  useEffect(() => {
    if (user?.roleData && user.role === 'vendor') {
      const vendorData = user.roleData as any;
      setVendorProfile({
        businessName: vendorData.businessName || '',
        category: vendorData.category || '',
        description: vendorData.description || '',
        location: vendorData.location || '',
        phone: vendorData.phone || '',
        website: vendorData.website || '',
        instagram: vendorData.instagram || '',
        pinterest: vendorData.pinterest || ''
      });
    }
  }, [user]);

  // Queries
  const { data: inquiries } = useQuery({
    queryKey: ["/api/inquiries/received"],
    enabled: isAuthenticated && user?.role === 'vendor',
  });

  const { data: portfolio } = useQuery({
    queryKey: ["/api/vendor/portfolio"],
    enabled: isAuthenticated && user?.role === 'vendor',
  });

  const { data: availability } = useQuery({
    queryKey: ["/api/vendor/availability"],
    enabled: isAuthenticated && user?.role === 'vendor',
  });

  // Mutations
  const respondToInquiryMutation = useMutation({
    mutationFn: async ({ inquiryId, response, status }: { inquiryId: string; response: string; status: string }) => {
      return apiRequest('PUT', `/api/inquiries/${inquiryId}/respond`, { response, status });
    },
    onSuccess: () => {
      toast({
        title: "Response Sent",
        description: "Your response has been sent to the client.",
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

  const updateAvailabilityMutation = useMutation({
    mutationFn: async ({ date, isAvailable }: { date: Date; isAvailable: boolean }) => {
      return apiRequest('PUT', '/api/vendor/availability', {
        date: date.toISOString(),
        isAvailable
      });
    },
    onSuccess: () => {
      toast({
        title: "Availability Updated",
        description: "Your calendar availability has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/availability"] });
      setIsDateDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update availability.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return apiRequest('PUT', '/api/vendor/profile', profileData);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your vendor profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/objects/upload');
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const file = result.successful[0];
      const uploadURL = file.uploadURL;
      
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

  const handleDateAvailabilityToggle = (date: Date, currentAvailability: boolean) => {
    updateAvailabilityMutation.mutate({
      date,
      isAvailable: !currentAvailability
    });
  };

  const handleProfileSave = () => {
    updateProfileMutation.mutate(vendorProfile);
  };

  const getAvailabilityForDate = (date: Date) => {
    if (!availability || !Array.isArray(availability)) return true;
    const dateStr = date.toDateString();
    const availabilityRecord = availability.find((a: any) => 
      new Date(a.date).toDateString() === dateStr
    );
    return availabilityRecord?.isAvailable ?? true;
  };

  const getBookedDates = () => {
    if (!availability || !Array.isArray(availability)) return [];
    return availability
      .filter((a: any) => !a.isAvailable && a.eventTitle)
      .map((a: any) => ({
        date: new Date(a.date),
        title: a.eventTitle,
        eventType: a.eventType
      }));
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-charcoal mb-2">
            Welcome back, {(user?.role === 'vendor' ? (user?.roleData as any)?.businessName : null) || 'Vendor'}!
          </h1>
          <p className="text-charcoal/70">Manage your business and connect with clients planning their perfect events.</p>
        </div>

        {/* Tabs Dashboard */}
        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inquiries" className="flex items-center gap-2" data-testid="tab-inquiries">
              <Inbox className="w-4 h-4" />
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2" data-testid="tab-calendar">
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2" data-testid="tab-portfolio">
              <Camera className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2" data-testid="tab-profile">
              <Edit className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="mt-6">
            <Card data-testid="card-inquiries">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Client Inquiries</span>
                  <Badge variant="outline" data-testid="inquiries-count">
                    {inquiries?.length || 0} Total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries && Array.isArray(inquiries) && inquiries.length > 0 ? (
                    inquiries.map((inquiry: any, index: number) => (
                      <Card key={inquiry.id} className="border border-blush" data-testid={`inquiry-${index}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-charcoal" data-testid={`inquiry-name-${index}`}>
                                  Client Inquiry #{inquiry.id.slice(-6)}
                                </h4>
                                <Badge 
                                  variant={inquiry.status === 'pending' ? 'secondary' : 'default'}
                                  data-testid={`inquiry-status-${index}`}
                                >
                                  {inquiry.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-charcoal/60 mb-2">
                                <span className="font-medium">Event Date:</span> {inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString() : 'Not specified'}
                              </div>
                              <div className="text-sm text-charcoal/60 mb-2">
                                <span className="font-medium">Budget:</span> {inquiry.budget ? `$${parseFloat(inquiry.budget).toLocaleString()}` : 'Not specified'}
                              </div>
                              <div className="text-sm text-charcoal/60 mb-2">
                                <span className="font-medium">Event Type:</span> Wedding Planning
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm font-medium text-charcoal mb-2">Message:</p>
                            <p className="text-sm text-charcoal/70 bg-gray-50 p-3 rounded" data-testid={`inquiry-message-${index}`}>
                              {inquiry.message}
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            {inquiry.status === 'pending' && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      className="bg-sage text-white hover:bg-sage/90"
                                      onClick={() => setSelectedInquiry(inquiry)}
                                      data-testid={`button-respond-${index}`}
                                    >
                                      <MessageSquare className="w-4 h-4 mr-2" />
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
                                        <Label htmlFor="response">Your Response:</Label>
                                        <Textarea
                                          id="response"
                                          value={response}
                                          onChange={(e) => setResponse(e.target.value)}
                                          placeholder="Write your response to the client..."
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
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Send Response
                                        </Button>
                                        <Button 
                                          variant="outline"
                                          onClick={() => handleRespondToInquiry(selectedInquiry, 'declined')}
                                          disabled={respondToInquiryMutation.isPending}
                                          className="text-red-600 hover:bg-red-50"
                                          data-testid="button-decline-inquiry"
                                        >
                                          <X className="w-4 h-4 mr-2" />
                                          Decline
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-rose-gold border-rose-gold hover:bg-rose-gold hover:text-white"
                                  data-testid={`button-message-${index}`}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Message Client
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-charcoal/60" data-testid="text-no-inquiries">
                      <Inbox className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
                      <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
                      <p>Client inquiries will appear here when they reach out to you</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2" data-testid="card-calendar">
                <CardHeader>
                  <CardTitle>Event Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    modifiers={{
                      booked: (date) => getBookedDates().some(bookedDate => 
                        bookedDate.date.toDateString() === date.toDateString()
                      ),
                      available: (date) => getAvailabilityForDate(date),
                    }}
                    modifiersStyles={{
                      booked: { 
                        backgroundColor: '#ef4444', 
                        color: 'white',
                        fontWeight: 'bold'
                      },
                      available: { 
                        backgroundColor: '#22c55e', 
                        color: 'white' 
                      },
                    }}
                    className="rounded-md border"
                    data-testid="calendar-widget"
                  />
                </CardContent>
              </Card>

              <Card data-testid="card-availability-controls">
                <CardHeader>
                  <CardTitle>Manage Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Selected Date</h4>
                    <p className="text-sm text-charcoal/70">
                      {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
                    </p>
                  </div>
                  
                  {selectedDate && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Currently:</span>
                        <Badge variant={getAvailabilityForDate(selectedDate) ? "default" : "destructive"}>
                          {getAvailabilityForDate(selectedDate) ? 'Available' : 'Blocked'}
                        </Badge>
                      </div>
                      
                      <Button
                        onClick={() => handleDateAvailabilityToggle(selectedDate, getAvailabilityForDate(selectedDate))}
                        disabled={updateAvailabilityMutation.isPending}
                        className="w-full"
                        variant={getAvailabilityForDate(selectedDate) ? "destructive" : "default"}
                        data-testid="button-toggle-availability"
                      >
                        {getAvailabilityForDate(selectedDate) ? 'Block Date' : 'Mark Available'}
                      </Button>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Upcoming Booked Events</h4>
                    <div className="space-y-2">
                      {getBookedDates().slice(0, 5).map((bookedDate, index) => (
                        <div key={index} className="text-sm p-2 bg-red-50 rounded">
                          <div className="font-medium">{bookedDate.date.toLocaleDateString()}</div>
                          <div className="text-charcoal/70">{bookedDate.title}</div>
                        </div>
                      ))}
                      {getBookedDates().length === 0 && (
                        <p className="text-sm text-charcoal/60">No booked events</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6">
            <Card data-testid="card-portfolio">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Portfolio Gallery</span>
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
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Image Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {portfolio && Array.isArray(portfolio) && portfolio.length > 0 ? (
                      portfolio.map((item: any, index: number) => (
                        <div key={item.id} className="relative group cursor-pointer" data-testid={`portfolio-item-${index}`}>
                          <img 
                            src={item.imageUrl} 
                            alt={item.title || "Portfolio image"} 
                            className="w-full h-48 object-cover rounded-lg"
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
                      <div className="col-span-full text-center py-12 text-charcoal/60" data-testid="text-no-portfolio">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
                        <h3 className="text-lg font-semibold mb-2">No portfolio images yet</h3>
                        <p>Upload photos to showcase your best work</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Profile</Label>
                      <Input
                        id="instagram"
                        placeholder="https://instagram.com/yourusername"
                        value={vendorProfile.instagram}
                        onChange={(e) => setVendorProfile({...vendorProfile, instagram: e.target.value})}
                        data-testid="input-instagram"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pinterest">Pinterest Profile</Label>
                      <Input
                        id="pinterest"
                        placeholder="https://pinterest.com/yourusername"
                        value={vendorProfile.pinterest}
                        onChange={(e) => setVendorProfile({...vendorProfile, pinterest: e.target.value})}
                        data-testid="input-pinterest"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card data-testid="card-profile">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Vendor Profile</span>
                  <Button
                    onClick={handleProfileSave}
                    disabled={updateProfileMutation.isPending}
                    className="bg-sage text-white hover:bg-sage/90"
                    data-testid="button-save-profile"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={vendorProfile.businessName}
                      onChange={(e) => setVendorProfile({...vendorProfile, businessName: e.target.value})}
                      data-testid="input-business-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Service Category *</Label>
                    <Select
                      value={vendorProfile.category}
                      onValueChange={(value) => setVendorProfile({...vendorProfile, category: value})}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Videography">Videography</SelectItem>
                        <SelectItem value="Catering">Catering</SelectItem>
                        <SelectItem value="Venue">Venue</SelectItem>
                        <SelectItem value="Music & DJ">Music & DJ</SelectItem>
                        <SelectItem value="Flowers & Decorations">Flowers & Decorations</SelectItem>
                        <SelectItem value="Wedding Planning">Wedding Planning</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Other Services">Other Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={vendorProfile.description}
                    onChange={(e) => setVendorProfile({...vendorProfile, description: e.target.value})}
                    placeholder="Describe your services, experience, and what makes you special..."
                    data-testid="textarea-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-charcoal/60" />
                    <Input
                      id="location"
                      value={vendorProfile.location}
                      onChange={(e) => setVendorProfile({...vendorProfile, location: e.target.value})}
                      placeholder="City, State"
                      data-testid="input-location"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-charcoal/60" />
                      <Input
                        id="phone"
                        type="tel"
                        value={vendorProfile.phone}
                        onChange={(e) => setVendorProfile({...vendorProfile, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-charcoal/60" />
                      <Input
                        id="website"
                        type="url"
                        value={vendorProfile.website}
                        onChange={(e) => setVendorProfile({...vendorProfile, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                        data-testid="input-website"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}