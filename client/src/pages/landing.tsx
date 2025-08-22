import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Calendar, DollarSign, Star, Search, Sparkles, Instagram, Facebook, Twitter, Mail, Play, ArrowRight, CheckCircle, UserPlus, LogIn } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log('SignUp:', signUpData);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login:', loginData);
  };

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
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-charcoal hover:text-rose-gold"
                    data-testid="button-login"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-playfair text-charcoal">Welcome Back</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        data-testid="input-login-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-rose-gold hover:bg-rose-gold/90 text-white"
                      data-testid="button-submit-login"
                    >
                      Sign In
                    </Button>
                    <div className="text-center text-sm text-charcoal/60">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        className="text-rose-gold hover:underline"
                        onClick={() => {
                          setLoginOpen(false);
                          setSignUpOpen(true);
                        }}
                        data-testid="link-switch-to-signup"
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-rose-gold hover:bg-rose-gold/90 text-white"
                    data-testid="button-signup"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-playfair text-charcoal">Join WedSimplify</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstname">First Name</Label>
                        <Input
                          id="signup-firstname"
                          placeholder="First name"
                          value={signUpData.firstName}
                          onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                          required
                          data-testid="input-signup-firstname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastname">Last Name</Label>
                        <Input
                          id="signup-lastname"
                          placeholder="Last name"
                          value={signUpData.lastName}
                          onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                          required
                          data-testid="input-signup-lastname"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                        data-testid="input-signup-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-role">I am a...</Label>
                      <Select 
                        value={signUpData.role} 
                        onValueChange={(value) => setSignUpData({ ...signUpData, role: value })}
                        required
                      >
                        <SelectTrigger data-testid="select-signup-role">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="couple">Couple planning a wedding</SelectItem>
                          <SelectItem value="individual">Individual looking for services</SelectItem>
                          <SelectItem value="vendor">Vendor/Service provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          required
                          data-testid="input-signup-password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                          required
                          data-testid="input-signup-confirm-password"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-rose-gold to-dusty-blue hover:from-rose-gold/90 hover:to-dusty-blue/90 text-white"
                      data-testid="button-submit-signup"
                    >
                      Create Account
                    </Button>
                    
                    <div className="text-center text-sm text-charcoal/60">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="text-rose-gold hover:underline"
                        onClick={() => {
                          setSignUpOpen(false);
                          setLoginOpen(true);
                        }}
                        data-testid="link-switch-to-login"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-rose-gold to-dusty-blue overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/30 to-dusty-blue/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-champagne fill-champagne" />
                <span className="text-champagne font-medium">Trusted by 8,500+ happy couples</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
                Your Dream Event 
                <span className="text-champagne block"> Made Simple</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                From intimate celebrations to grand occasions, discover trusted vendors who'll make your special day absolutely perfect. Plan with confidence, celebrate with joy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-champagne text-charcoal hover:bg-champagne/90 px-10 py-6 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-start-planning-hero"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Start Planning Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur text-white border-white/40 hover:bg-white/20 px-8 py-6 text-lg"
                  data-testid="button-watch-video"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch How It Works
                </Button>
              </div>

              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Free to browse</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Verified vendors</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Instant messaging</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-rose-gold rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">Emily & James</div>
                          <div className="text-white/70 text-sm">Perfect wedding!</div>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm">"Found our dream photographer in just 2 days. Amazing experience!"</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">Jessica</div>
                          <div className="text-white/70 text-sm">Birthday party</div>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm">"Organized my mom's 60th with incredible vendors. So easy!"</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-8">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-dusty-blue rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">David Corp</div>
                          <div className="text-white/70 text-sm">Corporate event</div>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm">"Flawless company retreat. Professional vendors, smooth process."</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-champagne rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-charcoal" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">Sophia & Ryan</div>
                          <div className="text-white/70 text-sm">Engagement party</div>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm">"Every detail was perfect. Our guests still talk about it!"</p>
                    </div>
                  </div>
                </div>
              </div>
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
          <Card className="border-rose-gold/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-rose-gold/5" data-testid="card-vendor-discovery">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-rose-gold/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-3 font-playfair">Find Your Dream Team</h3>
              <p className="text-charcoal/70 leading-relaxed">
                💕 Discover handpicked vendors who'll bring your vision to life. From photographers who capture pure joy to caterers who create magic.
              </p>
              <div className="mt-4 text-rose-gold font-semibold">Browse 1,200+ vendors</div>
            </CardContent>
          </Card>

          <Card className="border-sage/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-sage/5" data-testid="card-portfolio-showcase">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sage to-sage/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-3 font-playfair">Showcase Excellence</h3>
              <p className="text-charcoal/70 leading-relaxed">
                ✨ Vendors, let your artistry shine! Create stunning galleries that make couples fall in love with your work at first sight.
              </p>
              <div className="mt-4 text-sage font-semibold">Join 1,200+ professionals</div>
            </CardContent>
          </Card>

          <Card className="border-dusty-blue/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-dusty-blue/5" data-testid="card-event-planning">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-dusty-blue to-dusty-blue/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-3 font-playfair">Plan Like a Pro</h3>
              <p className="text-charcoal/70 leading-relaxed">
                📅 Turn chaos into celebration! Our tools help you organize every precious moment, from first dance to final toast.
              </p>
              <div className="mt-4 text-dusty-blue font-semibold">Stay perfectly organized</div>
            </CardContent>
          </Card>

          <Card className="border-champagne/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-champagne/5" data-testid="card-budget-tracking">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-champagne to-champagne/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal mb-3 font-playfair">Budget Bliss</h3>
              <p className="text-charcoal/70 leading-relaxed">
                💰 Spend smart, celebrate more! Track every penny while ensuring your special day is everything you dreamed of.
              </p>
              <div className="mt-4 text-champagne font-semibold">Save an average $2,800</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-rose-gold/10 to-dusty-blue/10 rounded-3xl p-12 mx-auto max-w-4xl border border-rose-gold/20">
            <h3 className="text-3xl font-playfair font-bold text-charcoal mb-4">
              Ready to Create Something Beautiful?
            </h3>
            <p className="text-xl text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Join thousands of happy couples, individuals, and vendors who've made their dreams come true with WedSimplify.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-rose-gold to-dusty-blue text-white hover:from-rose-gold/90 hover:to-dusty-blue/90 px-12 py-6 text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-start-planning-main"
            >
              <Heart className="mr-3 h-6 w-6" />
              Start Your Journey Today
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <p className="text-sm text-charcoal/60 mt-4">Free to join • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-charcoal to-charcoal/90 text-white mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/5 to-dusty-blue/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-3xl font-playfair font-bold text-rose-gold mb-4">WedSimplify</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Your one-stop marketplace for weddings, celebrations, and special occasions. Connecting people with trusted vendors for events that matter.
              </p>
              
              <div className="flex space-x-4 mb-6">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-rose-gold/20 rounded-full flex items-center justify-center hover:bg-rose-gold/30 transition-colors group"
                  data-testid="link-instagram"
                >
                  <Instagram className="w-5 h-5 text-rose-gold group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-dusty-blue/20 rounded-full flex items-center justify-center hover:bg-dusty-blue/30 transition-colors group"
                  data-testid="link-facebook"
                >
                  <Facebook className="w-5 h-5 text-dusty-blue group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center hover:bg-sage/30 transition-colors group"
                  data-testid="link-twitter"
                >
                  <Twitter className="w-5 h-5 text-sage group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-champagne/20 rounded-full flex items-center justify-center hover:bg-champagne/30 transition-colors group"
                  data-testid="link-email"
                >
                  <Mail className="w-5 h-5 text-champagne group-hover:text-white transition-colors" />
                </a>
              </div>

              <div className="text-white/60 text-sm">
                ✨ Follow us for daily inspiration, vendor spotlights, and planning tips!
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">For Event Planners</h4>
              <ul className="space-y-3 text-white/70">
                <li><a href="#" className="hover:text-rose-gold transition-colors flex items-center">
                  <span className="w-2 h-2 bg-rose-gold rounded-full mr-3"></span>Find Vendors
                </a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors flex items-center">
                  <span className="w-2 h-2 bg-rose-gold rounded-full mr-3"></span>Budget Tracker
                </a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors flex items-center">
                  <span className="w-2 h-2 bg-rose-gold rounded-full mr-3"></span>Event Timeline
                </a></li>
                <li><a href="#" className="hover:text-rose-gold transition-colors flex items-center">
                  <span className="w-2 h-2 bg-rose-gold rounded-full mr-3"></span>Plan Any Occasion
                </a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">For Vendors</h4>
              <ul className="space-y-3 text-white/70">
                <li><a href="#" className="hover:text-dusty-blue transition-colors flex items-center">
                  <span className="w-2 h-2 bg-dusty-blue rounded-full mr-3"></span>Join as Vendor
                </a></li>
                <li><a href="#" className="hover:text-dusty-blue transition-colors flex items-center">
                  <span className="w-2 h-2 bg-dusty-blue rounded-full mr-3"></span>Vendor Dashboard
                </a></li>
                <li><a href="#" className="hover:text-dusty-blue transition-colors flex items-center">
                  <span className="w-2 h-2 bg-dusty-blue rounded-full mr-3"></span>Showcase Portfolio
                </a></li>
                <li><a href="#" className="hover:text-dusty-blue transition-colors flex items-center">
                  <span className="w-2 h-2 bg-dusty-blue rounded-full mr-3"></span>Success Stories
                </a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-white/70">
                <li><a href="#" className="hover:text-sage transition-colors flex items-center">
                  <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>About Us
                </a></li>
                <li><a href="#" className="hover:text-sage transition-colors flex items-center">
                  <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>Contact
                </a></li>
                <li><a href="#" className="hover:text-sage transition-colors flex items-center">
                  <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>Help Center
                </a></li>
                <li><a href="#" className="hover:text-sage transition-colors flex items-center">
                  <span className="w-2 h-2 bg-sage rounded-full mr-3"></span>Privacy Policy
                </a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-white/60 mb-4 md:mb-0">
                <p>&copy; 2024 WedSimplify. All rights reserved. Making every special occasion simple and stress-free.</p>
              </div>
              <div className="flex items-center space-x-6 text-white/60 text-sm">
                <span className="flex items-center">
                  <Heart className="w-4 h-4 text-rose-gold mr-1" />
                  Made with love for unforgettable moments
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
