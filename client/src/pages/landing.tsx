import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Calendar, DollarSign, Star, Search, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-warm-gray">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-playfair font-bold text-rose-gold">WedSimplify</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-charcoal hover:text-rose-gold"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
              Your Special Event 
              <span className="text-champagne"> Simplified</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              The one-stop marketplace for weddings, celebrations, and special occasions. Connect with trusted vendors for any event that matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-champagne text-charcoal hover:bg-champagne/90 px-8 py-4"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-get-started"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30 px-8 py-4"
                data-testid="button-learn-more"
              >
                Learn More
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
              <div data-testid="stat-events">
                <div className="text-2xl font-bold text-sage">8,500+</div>
                <div className="text-sm text-charcoal/70">Events Planned</div>
              </div>
              <div data-testid="stat-savings">
                <div className="text-2xl font-bold text-dusty-blue">$2,800</div>
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-4">
            Everything You Need for Any Special Occasion
          </h2>
          <p className="text-xl text-charcoal/70 max-w-3xl mx-auto">
            Whether you're a couple planning your wedding, an individual organizing a celebration, or a vendor looking to grow your business, 
            WedSimplify is your one-stop marketplace for all event services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-blush hover:shadow-md transition-shadow" data-testid="card-vendor-discovery">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-rose-gold" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Find Perfect Vendors</h3>
              <p className="text-charcoal/70">
                Discover trusted vendors for weddings, birthdays, corporate events, and any special occasion.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blush hover:shadow-md transition-shadow" data-testid="card-portfolio-showcase">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-sage" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Showcase Your Work</h3>
              <p className="text-charcoal/70">
                Vendors can display stunning portfolios and connect with clients seeking their expertise.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blush hover:shadow-md transition-shadow" data-testid="card-event-planning">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-dusty-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-dusty-blue" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Plan Any Event</h3>
              <p className="text-charcoal/70">
                From intimate gatherings to grand celebrations, organize timelines and manage every detail.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blush hover:shadow-md transition-shadow" data-testid="card-budget-tracking">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-champagne" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">Smart Budgeting</h3>
              <p className="text-charcoal/70">
                Track expenses and stay within budget for any celebration or special event.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-rose-gold text-white hover:bg-rose-gold/90"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-start-planning"
          >
Start Planning Your Event
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-playfair font-bold text-rose-gold mb-4">WedSimplify</h3>
              <p className="text-white/70 mb-4">
                Your one-stop marketplace for weddings, celebrations, and special occasions. Connecting people with trusted vendors for events that matter.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Event Planners</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-rose-gold transition-colors">Find Vendors</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Budget Tracker</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Event Timeline</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Plan Any Occasion</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-rose-gold transition-colors">Join as Vendor</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Vendor Dashboard</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Showcase Portfolio</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-rose-gold transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors">Success Stories</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 WedSimplify. All rights reserved. Making every special occasion simple and stress-free.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
