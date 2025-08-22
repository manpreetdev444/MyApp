import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/Navigation";
import VendorCard from "../components/VendorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, DollarSign } from "lucide-react";

export default function VendorBrowse() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data: vendors, isLoading, refetch } = useQuery({
    queryKey: ["/api/vendors", { search, category, location, minPrice, maxPrice }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      const response = await fetch(`/api/vendors?${params}`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },
  });

  const handleSearch = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setTimeout(() => refetch(), 0);
  };

  const vendorCategories = [
    'Photography',
    'Catering',
    'Venue',
    'Music',
    'Florist',
    'Cake',
    'Transportation',
    'Officiant',
  ];

  return (
    <div className="min-h-screen bg-warm-gray">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-playfair font-bold text-charcoal mb-2" data-testid="page-title">
            Find Your Perfect Vendors
          </h1>
          <p className="text-charcoal/70">
            Discover trusted wedding professionals in your area
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="border-blush shadow-sm" data-testid="filters-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <Input
                  placeholder="Search vendors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>

              {/* Category */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {vendorCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                  data-testid="input-location"
                />
              </div>

              {/* Price Range */}
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="pl-10"
                    data-testid="input-min-price"
                  />
                </div>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="pl-10"
                    data-testid="input-max-price"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSearch}
                  className="bg-rose-gold text-white hover:bg-rose-gold/90 flex-1"
                  data-testid="button-search"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex-1"
                  data-testid="button-clear-filters"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="border-blush animate-pulse" data-testid={`vendor-skeleton-${i}`}>
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : vendors && vendors.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-charcoal/70" data-testid="results-count">
                Found {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor: any, index: number) => (
                <VendorCard 
                  key={vendor.id} 
                  vendor={vendor} 
                  data-testid={`vendor-card-${index}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12" data-testid="no-vendors-found">
            <Filter className="w-12 h-12 mx-auto mb-4 text-charcoal/40" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">No vendors found</h3>
            <p className="text-charcoal/70 mb-4">
              Try adjusting your search criteria to find more vendors.
            </p>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
              className="text-rose-gold border-rose-gold hover:bg-rose-gold hover:text-white"
              data-testid="button-clear-all-filters"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
