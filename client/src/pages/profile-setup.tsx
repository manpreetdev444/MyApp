import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Briefcase } from "lucide-react";

export default function ProfileSetup() {
  const [selectedRole, setSelectedRole] = useState<'couple' | 'vendor' | ''>('');
  const [formData, setFormData] = useState({
    // Couple fields
    partnerName: '',
    weddingDate: '',
    budget: '',
    venue: '',
    guestCount: '',
    location: '',
    
    // Vendor fields
    businessName: '',
    category: '',
    description: '',
    phone: '',
    website: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    country: '',
    state: '',
    city: '',
  });
  
  const { toast } = useToast();

  const setupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/setup-profile', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Setup Complete",
        description: "Welcome to WedSimplify! Redirecting to your dashboard...",
      });
      window.location.reload(); // Refresh to load the dashboard
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose whether you're planning a wedding or offering services",
        variant: "destructive",
      });
      return;
    }

    setupMutation.mutate({
      role: selectedRole,
      ...formData,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-playfair text-rose-gold mb-2">
            Welcome to WedSimplify!
          </CardTitle>
          <p className="text-charcoal/70">
            Let's set up your profile to get you started
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="text-base font-semibold text-charcoal mb-4 block">
                I am a...
              </Label>
              <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="couple" id="couple" />
                  <Label 
                    htmlFor="couple" 
                    className="flex items-center gap-2 cursor-pointer p-4 border rounded-lg hover:bg-blush/50 flex-1"
                  >
                    <Heart className="w-5 h-5 text-rose-gold" />
                    <div>
                      <div className="font-semibold">Couple</div>
                      <div className="text-sm text-charcoal/70">Planning a wedding</div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label 
                    htmlFor="vendor" 
                    className="flex items-center gap-2 cursor-pointer p-4 border rounded-lg hover:bg-blush/50 flex-1"
                  >
                    <Briefcase className="w-5 h-5 text-sage" />
                    <div>
                      <div className="font-semibold">Vendor</div>
                      <div className="text-sm text-charcoal/70">Offering services</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Couple Fields */}
            {selectedRole === 'couple' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-charcoal">Wedding Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partnerName">Partner's Name</Label>
                    <Input
                      id="partnerName"
                      value={formData.partnerName}
                      onChange={(e) => handleInputChange('partnerName', e.target.value)}
                      placeholder="Your partner's name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="weddingDate">Wedding Date</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Total Budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="e.g., 25000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guestCount">Guest Count</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={formData.guestCount}
                      onChange={(e) => handleInputChange('guestCount', e.target.value)}
                      placeholder="e.g., 150"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Wedding Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
            )}

            {/* Vendor Fields */}
            {selectedRole === 'vendor' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-charcoal">Business Details</h3>
                
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Your business name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="photography">Photography</option>
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="music">Music & DJ</option>
                    <option value="flowers">Flowers & Decoration</option>
                    <option value="planning">Wedding Planning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Location Fields */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-charcoal">Business Location</h4>
                  
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="e.g., United States"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        required
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="e.g., California"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g., Los Angeles"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about your services..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Social Media Fields */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-charcoal">Social Media</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        placeholder="@yourbusiness"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={formData.facebook}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                        placeholder="facebook.com/yourbusiness"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      value={formData.tiktok}
                      onChange={(e) => handleInputChange('tiktok', e.target.value)}
                      placeholder="@yourbusiness"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-rose-gold text-white hover:bg-rose-gold/90"
              disabled={!selectedRole || setupMutation.isPending}
            >
              {setupMutation.isPending ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}