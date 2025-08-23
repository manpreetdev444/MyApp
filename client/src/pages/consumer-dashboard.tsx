import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search,
  Heart,
  HeartOff,
  MessageSquare,
  Eye,
  Filter,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  Save,
  User
} from "lucide-react";

export default function ConsumerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [messageContent, setMessageContent] = useState('');
  const [consumerProfile, setConsumerProfile] = useState({
    partnerName: '',
    weddingDate: '',
    venue: '',
    guestCount: '',
    budget: '',
    style: '',
    location: ''
  });
  const [newBudgetItem, setNewBudgetItem] = useState({
    category: '',
    description: '',
    estimatedCost: '',
    actualCost: ''
  });
  const [newTimelineItem, setNewTimelineItem] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
    priority: 'medium'
  });
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryBudget, setInquiryBudget] = useState('');
  const [inquiryEventDate, setInquiryEventDate] = useState('');

  // Redirect if not authenticated or not a consumer (couple/individual)
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role === 'vendor')) {
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

  // Load consumer profile data when user is available
  useEffect(() => {
    if (user?.roleData && (user.role === 'couple' || user.role === 'individual')) {
      const consumerData = user.roleData as any;
      setConsumerProfile({
        partnerName: consumerData.partnerName || '',
        weddingDate: consumerData.weddingDate ? new Date(consumerData.weddingDate).toISOString().split('T')[0] : '',
        venue: consumerData.venue || '',
        guestCount: consumerData.guestCount?.toString() || '',
        budget: consumerData.budget || '',
        style: consumerData.style || '',
        location: consumerData.location || ''
      });
    }
  }, [user]);

  // Queries
  const { data: vendors, refetch: refetchVendors } = useQuery({
    queryKey: ["/api/vendors", { searchQuery, categoryFilter, locationFilter, budgetFilter }],
    enabled: isAuthenticated && user?.role !== 'vendor',
  });

  const { data: savedVendors } = useQuery({
    queryKey: ["/api/saved-vendors"],
    enabled: isAuthenticated && user?.role !== 'vendor',
  });

  const { data: inquiries } = useQuery({
    queryKey: ["/api/inquiries"],
    enabled: isAuthenticated && user?.role !== 'vendor',
  });

  const { data: budgetItems } = useQuery({
    queryKey: ["/api/budget-items"],
    enabled: isAuthenticated && user?.role !== 'vendor',
  });

  const { data: timelineItems } = useQuery({
    queryKey: ["/api/timeline-items"],
    enabled: isAuthenticated && user?.role !== 'vendor',
  });

  // Mutations
  const saveVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      return apiRequest('POST', '/api/saved-vendors', { vendorId });
    },
    onSuccess: () => {
      toast({
        title: "Vendor Saved",
        description: "Vendor has been added to your favorites.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-vendors"] });
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
        description: "Failed to save vendor.",
        variant: "destructive",
      });
    },
  });

  const unsaveVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      return apiRequest('DELETE', `/api/saved-vendors/${vendorId}`);
    },
    onSuccess: () => {
      toast({
        title: "Vendor Removed",
        description: "Vendor has been removed from your favorites.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-vendors"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove vendor.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return apiRequest('PUT', '/api/profile', profileData);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
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

  const createBudgetItemMutation = useMutation({
    mutationFn: async (budgetData: any) => {
      return apiRequest('POST', '/api/budget-items', budgetData);
    },
    onSuccess: () => {
      toast({
        title: "Budget Item Added",
        description: "Budget item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/budget-items"] });
      setIsBudgetDialogOpen(false);
      setNewBudgetItem({ category: '', description: '', estimatedCost: '', actualCost: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add budget item.",
        variant: "destructive",
      });
    },
  });

  const createTimelineItemMutation = useMutation({
    mutationFn: async (timelineData: any) => {
      return apiRequest('POST', '/api/timeline-items', timelineData);
    },
    onSuccess: () => {
      toast({
        title: "Timeline Item Added",
        description: "Timeline item has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/timeline-items"] });
      setIsTimelineDialogOpen(false);
      setNewTimelineItem({ title: '', description: '', dueDate: '', category: '', priority: 'medium' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add timeline item.",
        variant: "destructive",
      });
    },
  });

  const sendInquiryMutation = useMutation({
    mutationFn: async (inquiryData: any) => {
      return apiRequest('POST', '/api/inquiries', inquiryData);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent to the vendor.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      setIsInquiryDialogOpen(false);
      setInquiryMessage('');
      setInquiryBudget('');
      setInquiryEventDate('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send inquiry.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleSearch = () => {
    refetchVendors();
  };

  const handleSaveVendor = (vendorId: string, isSaved: boolean) => {
    if (isSaved) {
      unsaveVendorMutation.mutate(vendorId);
    } else {
      saveVendorMutation.mutate(vendorId);
    }
  };

  const handleProfileSave = () => {
    const profileData = {
      ...consumerProfile,
      weddingDate: consumerProfile.weddingDate ? new Date(consumerProfile.weddingDate) : null,
      guestCount: consumerProfile.guestCount ? parseInt(consumerProfile.guestCount) : null,
    };
    updateProfileMutation.mutate(profileData);
  };

  const handleCreateBudgetItem = () => {
    createBudgetItemMutation.mutate({
      ...newBudgetItem,
      estimatedCost: parseFloat(newBudgetItem.estimatedCost) || 0,
      actualCost: parseFloat(newBudgetItem.actualCost) || 0,
    });
  };

  const handleCreateTimelineItem = () => {
    createTimelineItemMutation.mutate({
      ...newTimelineItem,
      dueDate: newTimelineItem.dueDate ? new Date(newTimelineItem.dueDate) : null,
    });
  };

  const handleSendInquiry = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsInquiryDialogOpen(true);
  };

  const handleSubmitInquiry = () => {
    if (!selectedVendor) return;
    sendInquiryMutation.mutate({
      vendorId: selectedVendor.id,
      message: inquiryMessage,
      budget: parseFloat(inquiryBudget) || null,
      eventDate: inquiryEventDate ? new Date(inquiryEventDate) : null,
    });
  };

  const getTotalBudget = () => {
    if (!budgetItems || !Array.isArray(budgetItems)) return { estimated: 0, actual: 0 };
    return budgetItems.reduce((acc: any, item: any) => {
      acc.estimated += parseFloat(item.estimatedCost || 0);
      acc.actual += parseFloat(item.actualCost || 0);
      return acc;
    }, { estimated: 0, actual: 0 });
  };

  const getUpcomingTasks = () => {
    if (!timelineItems || !Array.isArray(timelineItems)) return [];
    return timelineItems
      .filter((item: any) => !item.isCompleted && item.dueDate)
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  };

  const isVendorSaved = (vendorId: string) => {
    return (savedVendors as any)?.some((saved: any) => saved.vendorId === vendorId) || false;
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
            Welcome back, {user?.firstName || 'There'}!
          </h1>
          <p className="text-charcoal/70">Plan your perfect event and connect with amazing vendors.</p>
        </div>

        {/* Tabs Dashboard */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="search" className="flex items-center gap-2" data-testid="tab-search">
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2" data-testid="tab-saved">
              <Heart className="w-4 h-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2" data-testid="tab-inquiries">
              <MessageSquare className="w-4 h-4" />
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2" data-testid="tab-budget">
              <DollarSign className="w-4 h-4" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2" data-testid="tab-timeline">
              <Calendar className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2" data-testid="tab-profile">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Search Vendors Tab */}
          <TabsContent value="search" className="mt-6">
            <Card data-testid="card-search">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Find Your Perfect Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search vendors by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="input-search"
                      />
                    </div>
                    <Button 
                      onClick={handleSearch}
                      className="bg-rose-gold text-white hover:bg-rose-gold/90"
                      data-testid="button-search"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Service Category</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
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
                    
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="City, State"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        data-testid="input-location"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Budget Range</Label>
                      <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                        <SelectTrigger data-testid="select-budget">
                          <SelectValue placeholder="Any Budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any Budget</SelectItem>
                          <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                          <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                          <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10000+">$10,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Vendor Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendors && Array.isArray(vendors) && vendors.length > 0 ? (
                    vendors.map((vendor: any, index: number) => (
                      <Card key={vendor.id} className="border border-blush hover:shadow-lg transition-shadow" data-testid={`vendor-card-${index}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-charcoal mb-1" data-testid={`vendor-name-${index}`}>
                                {vendor.businessName}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" data-testid={`vendor-category-${index}`}>
                                  {vendor.category}
                                </Badge>
                                <div className="flex items-center text-sm text-charcoal/60">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  {vendor.rating ? vendor.rating.toFixed(1) : 'New'}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveVendor(vendor.id, isVendorSaved(vendor.id))}
                              className="text-rose-gold hover:text-rose-gold/80"
                              data-testid={`button-save-${index}`}
                            >
                              {isVendorSaved(vendor.id) ? (
                                <Heart className="w-5 h-5 fill-rose-gold" />
                              ) : (
                                <HeartOff className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                          
                          <p className="text-sm text-charcoal/70 mb-4" data-testid={`vendor-description-${index}`}>
                            {vendor.description ? (
                              vendor.description.length > 100 
                                ? vendor.description.substring(0, 100) + '...'
                                : vendor.description
                            ) : 'Professional event services'}
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            {vendor.location && (
                              <div className="flex items-center text-sm text-charcoal/60">
                                <MapPin className="w-4 h-4 mr-2" />
                                {vendor.location}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-charcoal/60">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Starting at $2,500
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-sage text-white hover:bg-sage/90"
                              data-testid={`button-view-profile-${index}`}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 text-rose-gold border-rose-gold hover:bg-rose-gold hover:text-white"
                              onClick={() => handleSendInquiry(vendor)}
                              data-testid={`button-inquire-${index}`}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Inquire
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-charcoal/60" data-testid="text-no-vendors">
                      <Search className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
                      <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
                      <p>Try adjusting your search criteria or browse all vendors</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Vendors Tab */}
          <TabsContent value="saved" className="mt-6">
            <Card data-testid="card-saved">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-gold" />
                  Your Saved Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedVendors && Array.isArray(savedVendors) && savedVendors.length > 0 ? (
                    savedVendors.map((saved: any, index: number) => (
                      <Card key={saved.id} className="border border-blush" data-testid={`saved-vendor-${index}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-charcoal mb-1">
                                {saved.vendor?.businessName || 'Vendor'}
                              </h3>
                              <Badge variant="secondary" className="mb-2">
                                {saved.vendor?.category || 'Service'}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveVendor(saved.vendorId, true)}
                              className="text-rose-gold hover:text-rose-gold/80"
                              data-testid={`button-unsave-${index}`}
                            >
                              <Heart className="w-5 h-5 fill-rose-gold" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-charcoal/70 mb-4">
                            {saved.vendor?.description ? (
                              saved.vendor.description.length > 100 
                                ? saved.vendor.description.substring(0, 100) + '...'
                                : saved.vendor.description
                            ) : 'Professional event services'}
                          </p>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1 bg-sage text-white hover:bg-sage/90">
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-charcoal/60" data-testid="text-no-saved-vendors">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
                      <h3 className="text-lg font-semibold mb-2">No saved vendors yet</h3>
                      <p>Heart the vendors you like while searching to save them here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="mt-6">
            <Card data-testid="card-inquiries">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Your Inquiries
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
                              <h4 className="font-semibold text-charcoal mb-2">
                                Inquiry to {inquiry.vendor?.businessName || 'Vendor'}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-charcoal/60 mb-2">
                                <span>Status:</span>
                                <Badge 
                                  variant={inquiry.status === 'pending' ? 'secondary' : inquiry.status === 'accepted' ? 'default' : 'destructive'}
                                  data-testid={`inquiry-status-${index}`}
                                >
                                  {inquiry.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-charcoal/60 mb-2">
                                Sent: {new Date(inquiry.createdAt).toLocaleDateString()}
                              </div>
                              {inquiry.eventDate && (
                                <div className="text-sm text-charcoal/60 mb-2">
                                  Event Date: {new Date(inquiry.eventDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium text-charcoal mb-2">Your Message:</p>
                            <p className="text-sm text-charcoal/70 bg-gray-50 p-3 rounded">
                              {inquiry.message}
                            </p>
                          </div>

                          {inquiry.vendorResponse && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-charcoal mb-2">Vendor Response:</p>
                              <p className="text-sm text-charcoal/70 bg-sage/10 p-3 rounded">
                                {inquiry.vendorResponse}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedInquiry(inquiry)}
                                  data-testid={`button-message-${index}`}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Message Vendor
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Message {inquiry.vendor?.businessName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="message">Your Message:</Label>
                                    <Textarea
                                      id="message"
                                      value={messageContent}
                                      onChange={(e) => setMessageContent(e.target.value)}
                                      placeholder="Write your message..."
                                      rows={4}
                                    />
                                  </div>
                                  <Button className="w-full bg-sage text-white hover:bg-sage/90">
                                    Send Message
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Vendor Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-charcoal/60" data-testid="text-no-inquiries">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
                      <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
                      <p>Start reaching out to vendors to see your inquiries here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2" data-testid="card-budget">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Budget Breakdown</span>
                    <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-rose-gold text-white hover:bg-rose-gold/90" data-testid="button-add-budget-item">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-budget-item">
                        <DialogHeader>
                          <DialogTitle>Add Budget Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="budget-category">Category</Label>
                            <Select value={newBudgetItem.category} onValueChange={(value) => setNewBudgetItem({...newBudgetItem, category: value})}>
                              <SelectTrigger data-testid="select-budget-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Photography">Photography</SelectItem>
                                <SelectItem value="Videography">Videography</SelectItem>
                                <SelectItem value="Venue">Venue</SelectItem>
                                <SelectItem value="Catering">Catering</SelectItem>
                                <SelectItem value="Music & DJ">Music & DJ</SelectItem>
                                <SelectItem value="Flowers">Flowers & Decorations</SelectItem>
                                <SelectItem value="Attire">Attire</SelectItem>
                                <SelectItem value="Transportation">Transportation</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="budget-description">Description</Label>
                            <Input
                              id="budget-description"
                              value={newBudgetItem.description}
                              onChange={(e) => setNewBudgetItem({...newBudgetItem, description: e.target.value})}
                              placeholder="e.g., Wedding photographer for 8 hours"
                              data-testid="input-budget-description"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                              <Input
                                id="estimated-cost"
                                type="number"
                                value={newBudgetItem.estimatedCost}
                                onChange={(e) => setNewBudgetItem({...newBudgetItem, estimatedCost: e.target.value})}
                                placeholder="2500"
                                data-testid="input-estimated-cost"
                              />
                            </div>
                            <div>
                              <Label htmlFor="actual-cost">Actual Cost ($)</Label>
                              <Input
                                id="actual-cost"
                                type="number"
                                value={newBudgetItem.actualCost}
                                onChange={(e) => setNewBudgetItem({...newBudgetItem, actualCost: e.target.value})}
                                placeholder="2800"
                                data-testid="input-actual-cost"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={handleCreateBudgetItem}
                            disabled={!newBudgetItem.category || !newBudgetItem.description || createBudgetItemMutation.isPending}
                            className="w-full bg-sage text-white hover:bg-sage/90"
                            data-testid="button-save-budget-item"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Add Budget Item
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetItems && Array.isArray(budgetItems) && budgetItems.length > 0 ? (
                      budgetItems.map((item: any, index: number) => (
                        <Card key={item.id} className="border border-blush" data-testid={`budget-item-${index}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-charcoal mb-1" data-testid={`budget-description-${index}`}>
                                  {item.description}
                                </h4>
                                <Badge variant="secondary" className="mb-2">
                                  {item.category}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-charcoal/60 mb-1">Estimated</div>
                                <div className="font-semibold text-sage" data-testid={`budget-estimated-${index}`}>
                                  ${parseFloat(item.estimatedCost || 0).toLocaleString()}
                                </div>
                                {item.actualCost && (
                                  <>
                                    <div className="text-sm text-charcoal/60 mt-2 mb-1">Actual</div>
                                    <div className="font-semibold text-rose-gold" data-testid={`budget-actual-${index}`}>
                                      ${parseFloat(item.actualCost).toLocaleString()}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-charcoal/60" data-testid="text-no-budget-items">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
                        <h3 className="text-lg font-semibold mb-2">No budget items yet</h3>
                        <p>Start tracking your event expenses by adding budget items</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-budget-summary">
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-sage/10 rounded-lg">
                      <div className="text-sm text-charcoal/60 mb-1">Total Estimated</div>
                      <div className="text-2xl font-bold text-sage" data-testid="total-estimated">
                        ${getTotalBudget().estimated.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-rose-gold/10 rounded-lg">
                      <div className="text-sm text-charcoal/60 mb-1">Total Spent</div>
                      <div className="text-2xl font-bold text-rose-gold" data-testid="total-spent">
                        ${getTotalBudget().actual.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-dusty-blue/10 rounded-lg">
                      <div className="text-sm text-charcoal/60 mb-1">Remaining</div>
                      <div className="text-2xl font-bold text-dusty-blue" data-testid="budget-remaining">
                        ${(getTotalBudget().estimated - getTotalBudget().actual).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Budget Tips</h4>
                    <ul className="text-sm text-charcoal/70 space-y-2">
                      <li>• Set aside 10-15% for unexpected costs</li>
                      <li>• Get quotes from multiple vendors</li>
                      <li>• Track deposits and final payments</li>
                      <li>• Consider seasonal pricing variations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2" data-testid="card-timeline">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Wedding Timeline</span>
                    <Dialog open={isTimelineDialogOpen} onOpenChange={setIsTimelineDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-rose-gold text-white hover:bg-rose-gold/90" data-testid="button-add-timeline-item">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-timeline-item">
                        <DialogHeader>
                          <DialogTitle>Add Timeline Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="task-title">Task Title</Label>
                            <Input
                              id="task-title"
                              value={newTimelineItem.title}
                              onChange={(e) => setNewTimelineItem({...newTimelineItem, title: e.target.value})}
                              placeholder="e.g., Book venue, Send invitations"
                              data-testid="input-task-title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="task-description">Description</Label>
                            <Textarea
                              id="task-description"
                              value={newTimelineItem.description}
                              onChange={(e) => setNewTimelineItem({...newTimelineItem, description: e.target.value})}
                              placeholder="Additional details about this task..."
                              rows={2}
                              data-testid="textarea-task-description"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="due-date">Due Date</Label>
                              <Input
                                id="due-date"
                                type="date"
                                value={newTimelineItem.dueDate}
                                onChange={(e) => setNewTimelineItem({...newTimelineItem, dueDate: e.target.value})}
                                data-testid="input-due-date"
                              />
                            </div>
                            <div>
                              <Label htmlFor="task-priority">Priority</Label>
                              <Select value={newTimelineItem.priority} onValueChange={(value) => setNewTimelineItem({...newTimelineItem, priority: value})}>
                                <SelectTrigger data-testid="select-priority">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="task-category">Category</Label>
                            <Select value={newTimelineItem.category} onValueChange={(value) => setNewTimelineItem({...newTimelineItem, category: value})}>
                              <SelectTrigger data-testid="select-task-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Venue">Venue</SelectItem>
                                <SelectItem value="Catering">Catering</SelectItem>
                                <SelectItem value="Photography">Photography</SelectItem>
                                <SelectItem value="Music">Music & Entertainment</SelectItem>
                                <SelectItem value="Flowers">Flowers & Decorations</SelectItem>
                                <SelectItem value="Attire">Attire & Beauty</SelectItem>
                                <SelectItem value="Invitations">Invitations & Stationery</SelectItem>
                                <SelectItem value="Legal">Legal & Documentation</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            onClick={handleCreateTimelineItem}
                            disabled={!newTimelineItem.title || createTimelineItemMutation.isPending}
                            className="w-full bg-sage text-white hover:bg-sage/90"
                            data-testid="button-save-timeline-item"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Add Task
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timelineItems && Array.isArray(timelineItems) && timelineItems.length > 0 ? (
                      timelineItems.map((item: any, index: number) => (
                        <Card key={item.id} className={`border ${item.isCompleted ? 'border-sage bg-sage/5' : 'border-blush'}`} data-testid={`timeline-item-${index}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={item.isCompleted}
                                  className="mt-1 w-4 h-4 text-sage"
                                  data-testid={`checkbox-complete-${index}`}
                                />
                                <div className="flex-1">
                                  <h4 className={`font-semibold mb-1 ${item.isCompleted ? 'text-sage line-through' : 'text-charcoal'}`} data-testid={`timeline-title-${index}`}>
                                    {item.title}
                                  </h4>
                                  {item.description && (
                                    <p className="text-sm text-charcoal/70 mb-2" data-testid={`timeline-description-${index}`}>
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-sm">
                                    {item.category && (
                                      <Badge variant="secondary">{item.category}</Badge>
                                    )}
                                    {item.dueDate && (
                                      <div className="flex items-center text-charcoal/60">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(item.dueDate).toLocaleDateString()}
                                      </div>
                                    )}
                                    <Badge 
                                      variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                                      data-testid={`timeline-priority-${index}`}
                                    >
                                      {item.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-charcoal/60" data-testid="text-no-timeline-items">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
                        <h3 className="text-lg font-semibold mb-2">No timeline tasks yet</h3>
                        <p>Create a timeline to keep track of your wedding planning progress</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-upcoming-tasks">
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getUpcomingTasks().length > 0 ? (
                    getUpcomingTasks().map((task: any, index: number) => (
                      <div key={task.id} className="p-3 border border-blush rounded-lg" data-testid={`upcoming-task-${index}`}>
                        <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                        <div className="text-xs text-charcoal/60 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                          <Badge size="sm" variant={task.priority === 'high' ? 'destructive' : 'default'}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-charcoal/60">No upcoming tasks</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inquiry Dialog */}
          <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
            <DialogContent data-testid="dialog-send-inquiry">
              <DialogHeader>
                <DialogTitle>
                  Send Inquiry to {selectedVendor?.businessName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inquiry-message">Message</Label>
                  <Textarea
                    id="inquiry-message"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Hi! I'm interested in your services for my wedding. Could you please provide more details about availability and pricing?"
                    rows={4}
                    data-testid="textarea-inquiry-message"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inquiry-budget">Budget ($)</Label>
                    <Input
                      id="inquiry-budget"
                      type="number"
                      value={inquiryBudget}
                      onChange={(e) => setInquiryBudget(e.target.value)}
                      placeholder="3000"
                      data-testid="input-inquiry-budget"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiry-event-date">Event Date</Label>
                    <Input
                      id="inquiry-event-date"
                      type="date"
                      value={inquiryEventDate}
                      onChange={(e) => setInquiryEventDate(e.target.value)}
                      data-testid="input-inquiry-event-date"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSubmitInquiry}
                  disabled={!inquiryMessage.trim() || sendInquiryMutation.isPending}
                  className="w-full bg-sage text-white hover:bg-sage/90"
                  data-testid="button-submit-inquiry"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card data-testid="card-profile">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Profile
                  </span>
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
                    <Label htmlFor="partnerName">
                      {user?.role === 'couple' ? "Partner's Name" : "Full Name"}
                    </Label>
                    <Input
                      id="partnerName"
                      value={consumerProfile.partnerName}
                      onChange={(e) => setConsumerProfile({...consumerProfile, partnerName: e.target.value})}
                      data-testid="input-partner-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate">Event Date</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={consumerProfile.weddingDate}
                      onChange={(e) => setConsumerProfile({...consumerProfile, weddingDate: e.target.value})}
                      data-testid="input-event-date"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={consumerProfile.venue}
                    onChange={(e) => setConsumerProfile({...consumerProfile, venue: e.target.value})}
                    placeholder="Event venue or location"
                    data-testid="input-venue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="guestCount">Guest Count</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={consumerProfile.guestCount}
                      onChange={(e) => setConsumerProfile({...consumerProfile, guestCount: e.target.value})}
                      placeholder="Expected number of guests"
                      data-testid="input-guest-count"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Total Budget</Label>
                    <Input
                      id="budget"
                      value={consumerProfile.budget}
                      onChange={(e) => setConsumerProfile({...consumerProfile, budget: e.target.value})}
                      placeholder="$10,000"
                      data-testid="input-budget"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Event Style</Label>
                  <Select
                    value={consumerProfile.style}
                    onValueChange={(value) => setConsumerProfile({...consumerProfile, style: value})}
                  >
                    <SelectTrigger data-testid="select-style">
                      <SelectValue placeholder="Select your preferred style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Traditional">Traditional</SelectItem>
                      <SelectItem value="Modern">Modern</SelectItem>
                      <SelectItem value="Rustic">Rustic</SelectItem>
                      <SelectItem value="Vintage">Vintage</SelectItem>
                      <SelectItem value="Bohemian">Bohemian</SelectItem>
                      <SelectItem value="Minimalist">Minimalist</SelectItem>
                      <SelectItem value="Garden/Outdoor">Garden/Outdoor</SelectItem>
                      <SelectItem value="Beach">Beach</SelectItem>
                      <SelectItem value="Destination">Destination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Event Location</Label>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-charcoal/60" />
                    <Input
                      id="location"
                      value={consumerProfile.location}
                      onChange={(e) => setConsumerProfile({...consumerProfile, location: e.target.value})}
                      placeholder="City, State where your event will be"
                      data-testid="input-location-profile"
                    />
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