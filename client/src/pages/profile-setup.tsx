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
import { Heart, Briefcase, Plus, X } from "lucide-react";

export default function ProfileSetup() {
  const [selectedRole, setSelectedRole] = useState<'couple' | 'vendor' | ''>('');
  const [socialMediaLinks, setSocialMediaLinks] = useState([{ platform: '', url: '' }]);
  const [formData, setFormData] = useState({
    // Couple fields
    coupleName: '',
    email: '',
    weddingDate: '',
    budget: '',
    currency: 'USD',
    venue: '',
    guestCount: '',
    location: '',
    
    // Vendor fields
    businessName: '',
    category: '',
    subcategory: '',
    description: '',
    businessEmail: '',
    website: '',
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

    // Check for required fields based on role
    if (selectedRole === 'couple') {
      if (!formData.coupleName || !formData.email) {
        toast({
          title: "Missing Required Information",
          description: "Please fill in all required fields marked with *",
          variant: "destructive",
        });
        return;
      }
    } else if (selectedRole === 'vendor') {
      if (!formData.businessName || !formData.category || !formData.description || !formData.country || !formData.state || !formData.city) {
        toast({
          title: "Missing Required Information",
          description: "Please fill in all required fields marked with *",
          variant: "destructive",
        });
        return;
      }

      // Check if subcategory is required (all categories except "other")
      if (formData.category !== 'other' && !formData.subcategory) {
        toast({
          title: "Missing Subcategory",
          description: "Please select a subcategory for your business",
          variant: "destructive",
        });
        return;
      }
    }

    setupMutation.mutate({
      role: selectedRole,
      ...formData,
      socialMediaLinks: socialMediaLinks.filter(link => link.platform && link.url),
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      // If category changes, reset subcategory
      if (field === 'category') {
        return { ...prev, [field]: value as string, subcategory: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSocialMediaChange = (index: number, field: 'platform' | 'url', value: string) => {
    setSocialMediaLinks(prev => 
      prev.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    );
  };

  const addSocialMediaLink = () => {
    setSocialMediaLinks(prev => [...prev, { platform: '', url: '' }]);
  };

  const removeSocialMediaLink = (index: number) => {
    if (socialMediaLinks.length > 1) {
      setSocialMediaLinks(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Subcategory options based on category
  const subcategoryOptions: Record<string, string[]> = {
    "venues-decor": [
      "Banquet halls / wedding venues",
      "Destination wedding venues", 
      "Stage décor & backdrop designers",
      "Floral decorators",
      "Lighting & ambiance setup",
      "Tent / marquee rentals",
      "Other"
    ],
    "food-catering": [
      "Traditional caterers",
      "Multi-cuisine catering (fusion menus)",
      "Street food/live station catering",
      "Dessert vendors", 
      "Wedding cake specialists",
      "Bartending / mocktail services",
      "Other"
    ],
    "photography-videography": [
      "Wedding photographers (candid + traditional)",
      "Cinematic videographers",
      "Pre-wedding shoot specialists",
      "Drone photography",
      "Live streaming services",
      "Other"
    ],
    "beauty-grooming": [
      "Makeup artists",
      "Henna artists",
      "Hair stylists", 
      "Groom styling",
      "Nail & skincare specialists",
      "Other"
    ],
    "dj-entertainment": [
      "DJs",
      "Live bands",
      "Dance Performers",
      "MCs / wedding hosts",
      "Fireworks & special effects",
      "Other"
    ],
    "clothing-jewelry": [
      "Bridal clothing and tailors",
      "Groom clothing and tailors",
      "Custom jewelry designers",
      "Rental jewelry providers",
      "Accessories",
      "Other"
    ],
    "wedding-planners": [
      "Wedding planners / coordinators",
      "Day-of coordinators",
      "Destination wedding specialists",
      "Other"
    ]
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
              <RadioGroup value={selectedRole} onValueChange={(value: string) => setSelectedRole(value as 'couple' | 'vendor' | '')} className="grid grid-cols-2 gap-4">
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
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-charcoal">Wedding Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coupleName">What do we call you? *</Label>
                    <Input
                      id="coupleName"
                      required
                      value={formData.coupleName}
                      onChange={(e) => handleInputChange('coupleName', e.target.value)}
                      placeholder="e.g., Emma & David"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weddingDate">Wedding Date</Label>
                  <Input
                    id="weddingDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.weddingDate}
                    onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget">Total Budget</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="budget"
                        type="number"
                        min="0"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="Enter your budget amount"
                        className="w-full"
                      />
                    </div>
                    <div className="w-24">
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full p-2 border border-input rounded-md h-10"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guestCount">Guest Count</Label>
                  <select
                    id="guestCount"
                    value={formData.guestCount}
                    onChange={(e) => handleInputChange('guestCount', e.target.value)}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="">Select guest count range</option>
                    <option value="0-50">0 – 50 guests</option>
                    <option value="50-150">50 – 150 guests</option>
                    <option value="150-300">150 – 300 guests</option>
                    <option value="300+">300+ guests</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="location">Wedding Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter city, state or venue location"
                    className="w-full"
                  />
                  <p className="text-sm text-charcoal/60 mt-1">
                    Enter the city, state, or specific venue where your wedding will take place
                  </p>
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
                    <option value="venues-decor">Venues/Decor</option>
                    <option value="food-catering">Food & Catering</option>
                    <option value="photography-videography">Photography/Videography</option>
                    <option value="beauty-grooming">Beauty & Grooming</option>
                    <option value="dj-entertainment">DJ & Entertainment</option>
                    <option value="clothing-jewelry">Clothing/Jewelry</option>
                    <option value="wedding-planners">Wedding Planners</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subcategory - conditional */}
                {formData.category && formData.category !== 'other' && (
                  <div>
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <select
                      id="subcategory"
                      required
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      className="w-full p-2 border border-input rounded-md"
                    >
                      <option value="">Select subcategory</option>
                      {subcategoryOptions[formData.category]?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
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
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    required
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
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={formData.businessEmail}
                      onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                      placeholder="business@example.com"
                    />
                  </div>
                </div>

                {/* Social Media Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-charcoal">Social Media</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSocialMediaLink}
                      className="text-rose-gold border-rose-gold hover:bg-rose-gold/10"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Platform
                    </Button>
                  </div>
                  
                  {socialMediaLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Platform</Label>
                        <select
                          value={link.platform}
                          onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                          className="w-full p-2 border border-input rounded-md"
                        >
                          <option value="">Select platform</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                      </div>
                      
                      <div className="flex-2">
                        <Label>Profile URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                          placeholder={
                            link.platform === 'instagram' ? '@yourbusiness' :
                            link.platform === 'facebook' ? 'facebook.com/yourbusiness' :
                            link.platform === 'tiktok' ? '@yourbusiness' :
                            'Enter profile URL'
                          }
                        />
                      </div>
                      
                      {socialMediaLinks.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSocialMediaLink(index)}
                          className="text-red-500 border-red-300 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
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