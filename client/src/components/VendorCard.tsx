import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin } from "lucide-react";

interface VendorCardProps {
  vendor: {
    id: string;
    businessName: string;
    category: string;
    description?: string;
    location?: string;
    rating?: string;
    reviewCount?: number;
    portfolio?: Array<{ imageUrl: string; title?: string }>;
    packages?: Array<{ price: string }>;
  };
  className?: string;
  'data-testid'?: string;
}

export default function VendorCard({ vendor, className = "", ...props }: VendorCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300";
  const vendorImage = vendor.portfolio && vendor.portfolio.length > 0 
    ? vendor.portfolio[0].imageUrl 
    : defaultImage;

  const minPrice = vendor.packages && vendor.packages.length > 0 
    ? Math.min(...vendor.packages.map(pkg => parseFloat(pkg.price)))
    : null;

  const handleSaveVendor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement save to favorites functionality
    console.log('Save vendor:', vendor.id);
  };

  return (
    <Link href={`/vendor/${vendor.id}`}>
      <div 
        className={`border border-blush rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer bg-white ${className}`}
        {...props}
      >
        <div className="relative">
          <img 
            src={vendorImage}
            alt={`${vendor.businessName} portfolio`}
            className="w-full h-48 object-cover"
            data-testid="vendor-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur hover:bg-white/90 text-charcoal"
            onClick={handleSaveVendor}
            data-testid="button-save-vendor"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-charcoal text-lg leading-tight" data-testid="vendor-name">
              {vendor.businessName}
            </h3>
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm text-charcoal/70" data-testid="vendor-rating">
                {vendor.rating || '0.0'}
              </span>
            </div>
          </div>
          
          <Badge variant="secondary" className="mb-2" data-testid="vendor-category">
            {vendor.category}
          </Badge>
          
          {vendor.location && (
            <div className="flex items-center text-charcoal/60 mb-2" data-testid="vendor-location">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{vendor.location}</span>
            </div>
          )}
          
          <p className="text-sm text-charcoal/70 mb-3 line-clamp-2" data-testid="vendor-description">
            {vendor.description || 'Professional wedding services tailored to your special day.'}
          </p>
          
          <div className="flex items-center justify-between">
            {minPrice && (
              <span className="text-sm font-medium text-sage" data-testid="vendor-price">
                Starting at ${minPrice.toLocaleString()}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-rose-gold hover:text-rose-gold/80 p-0 h-auto font-medium"
              data-testid="button-contact-vendor"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
