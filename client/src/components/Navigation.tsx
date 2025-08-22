import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated || !user) {
    return null;
  }

  const isCouple = user.role === 'couple';
  const isVendor = user.role === 'vendor';

  const getDisplayName = () => {
    if (isCouple) {
      return user.roleData?.partnerName 
        ? `${user.firstName || 'User'} & ${user.roleData.partnerName}`
        : user.firstName || 'User';
    }
    return user.roleData?.businessName || user.firstName || 'Vendor';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-blush" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-playfair font-bold text-rose-gold cursor-pointer" data-testid="logo">
                  WedSimplify
                </h1>
              </Link>
              {isVendor && (
                <span className="text-xs text-charcoal/60">Vendor Portal</span>
              )}
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/">
                  <a 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location === '/' 
                        ? 'text-rose-gold' 
                        : 'text-charcoal hover:text-rose-gold'
                    }`}
                    data-testid="nav-dashboard"
                  >
                    Dashboard
                  </a>
                </Link>
                
                {isCouple && (
                  <>
                    <Link href="/vendors">
                      <a 
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          location === '/vendors' 
                            ? 'text-rose-gold' 
                            : 'text-charcoal hover:text-rose-gold'
                        }`}
                        data-testid="nav-vendors"
                      >
                        Find Vendors
                      </a>
                    </Link>
                    <a 
                      href="#timeline" 
                      className="text-charcoal hover:text-rose-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="nav-timeline"
                    >
                      Timeline
                    </a>
                    <a 
                      href="#budget" 
                      className="text-charcoal hover:text-rose-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="nav-budget"
                    >
                      Budget
                    </a>
                  </>
                )}

                {isVendor && (
                  <>
                    <a 
                      href="#inquiries" 
                      className="text-charcoal hover:text-rose-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="nav-inquiries"
                    >
                      Inquiries
                    </a>
                    <a 
                      href="#calendar" 
                      className="text-charcoal hover:text-rose-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="nav-calendar"
                    >
                      Calendar
                    </a>
                    <a 
                      href="#portfolio" 
                      className="text-charcoal hover:text-rose-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="nav-portfolio"
                    >
                      Portfolio
                    </a>
                    <a 
                      href="#profile" 
                      className="text-charcoal hover:text-rose-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      data-testid="nav-profile"
                    >
                      Profile
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center text-sm font-medium text-charcoal hover:text-rose-gold transition-colors"
                  data-testid="user-menu-trigger"
                >
                  <span data-testid="user-display-name">{getDisplayName()}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem data-testid="menu-profile">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-messages">
                  Messages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="menu-logout"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              className="bg-rose-gold text-white hover:bg-rose-gold/90 transition-all"
              data-testid="messages-button"
            >
              <Bell className="w-4 h-4 mr-2" />
              Messages
              {isVendor && (
                <span className="bg-champagne text-charcoal rounded-full px-2 py-1 text-xs ml-2" data-testid="notification-count">
                  3
                </span>
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-charcoal hover:text-rose-gold" data-testid="mobile-menu-button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
