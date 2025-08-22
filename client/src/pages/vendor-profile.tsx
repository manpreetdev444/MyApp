import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "../components/Navigation";
import InquiryModal from "../components/InquiryModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, Calendar, Mail, Phone, MapPin, Globe, Instagram, Eye } from "lucide-react";

export default function VendorProfile() {
  const { vendorId } = useParams();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["/api/vendors", vendorId],
    enabled: !!vendorId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gray-200 h-96 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-warm-gray">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Vendor Not Found</h1>
          <p className="text-charcoal/70">The vendor you're looking for doesn't exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  const handleSendInquiry = () => {
    setShowInquiryModal(true);
  };

  const handleSaveVendor = () => {
    // TODO: Implement save to favorites functionality
    console.log('Save vendor:', vendor.id);
  };

  const handleCheckAvailability = () => {
    // TODO: Implement availability checking
    console.log('Check availability for vendor:', vendor.id);
  };

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navigation />

      {/* Vendor Header */}
      <div className="relative">
        <div 
          className="w-full h-64 bg-cover bg-center" 
          style={{
            backgroundImage: vendor.portfolio && vendor.portfolio.length > 0 
              ? `url('${vendor.portfolio[0].imageUrl}')`
              : "url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400')"
          }}
          data-testid="vendor-header-image"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-playfair font-bold mb-2" data-testid="vendor-name">
            {vendor.businessName}
          </h1>
          <p className="text-white/90 mb-2" data-testid="vendor-category">
            {vendor.category}
          </p>
          <div className="flex items-center">
            <div className="flex items-center bg-white/20 backdrop-blur rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm" data-testid="vendor-rating">
                {vendor.rating || '0.0'}
              </span>
              <span className="text-sm text-white/70 ml-1">
                ({vendor.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <Card className="mb-8" data-testid="card-vendor-about">
              <CardContent className="p-6">
                <h2 className="text-xl font-playfair font-semibold mb-4">About</h2>
                <p className="text-charcoal/70 leading-relaxed" data-testid="vendor-description">
                  {vendor.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Portfolio Gallery */}
            <Card className="mb-8" data-testid="card-vendor-portfolio">
              <CardContent className="p-6">
                <h2 className="text-xl font-playfair font-semibold mb-4">Portfolio</h2>
                {vendor.portfolio && vendor.portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.portfolio.map((item: any, index: number) => (
                      <img 
                        key={item.id}
                        src={item.imageUrl} 
                        alt={item.title || "Portfolio image"} 
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        data-testid={`portfolio-image-${index}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-charcoal/60" data-testid="text-no-portfolio">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
                    <p>No portfolio images available</p>
                  </div>
                )}
                
                {vendor.portfolio && vendor.portfolio.length > 0 && (
                  <Button 
                    variant="ghost" 
                    className="mt-4 text-rose-gold hover:text-rose-gold/80"
                    data-testid="button-view-full-portfolio"
                  >
                    View Full Portfolio →
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card data-testid="card-vendor-reviews">
              <CardContent className="p-6">
                <h2 className="text-xl font-playfair font-semibold mb-4">Recent Reviews</h2>
                <div className="text-center py-8 text-charcoal/60" data-testid="text-no-reviews">
                  <Star className="w-8 h-8 mx-auto mb-2 text-charcoal/40" />
                  <p>No reviews yet</p>
                  <p className="text-sm">Be the first to book and leave a review!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6" data-testid="card-vendor-sidebar">
              <CardContent className="p-6">
                
                {/* Packages */}
                <div className="mb-6">
                  <h3 className="font-semibold text-charcoal mb-3">Packages</h3>
                  <div className="space-y-3">
                    {vendor.packages && vendor.packages.length > 0 ? (
                      vendor.packages.map((pkg: any, index: number) => (
                        <div 
                          key={pkg.id} 
                          className="border border-blush bg-white rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow"
                          onClick={() => setSelectedPackage(pkg)}
                          data-testid={`package-${index}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-charcoal" data-testid={`package-name-${index}`}>
                              {pkg.name}
                            </span>
                            <span className="text-sage font-semibold" data-testid={`package-price-${index}`}>
                              ${parseFloat(pkg.price).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-charcoal/70" data-testid={`package-description-${index}`}>
                            {pkg.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-charcoal/60" data-testid="text-no-packages">
                        <p className="text-sm">No packages available</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Contact Actions */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-rose-gold text-white hover:bg-rose-gold/90"
                    onClick={handleSendInquiry}
                    data-testid="button-send-inquiry"
                  >
                    Send Inquiry
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white"
                    onClick={handleSaveVendor}
                    data-testid="button-save-vendor"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Favorites
                  </Button>
                  <Button 
                    className="w-full bg-dusty-blue text-white hover:bg-dusty-blue/90"
                    onClick={handleCheckAvailability}
                    data-testid="button-check-availability"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Check Availability
                  </Button>
                </div>

                <Separator className="my-6" />

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-charcoal mb-3">Contact Details</h4>
                  <div className="space-y-2 text-sm text-charcoal/70">
                    {vendor.email && (
                      <div className="flex items-center" data-testid="vendor-email">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{vendor.email}</span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center" data-testid="vendor-phone">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.location && (
                      <div className="flex items-center" data-testid="vendor-location">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{vendor.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-3 mt-4">
                    {vendor.instagram && (
                      <a 
                        href={vendor.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-charcoal/60 hover:text-rose-gold transition-colors"
                        data-testid="vendor-instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {vendor.website && (
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-charcoal/60 hover:text-rose-gold transition-colors"
                        data-testid="vendor-website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        vendor={vendor}
        selectedPackage={selectedPackage}
      />
    </div>
  );
}
