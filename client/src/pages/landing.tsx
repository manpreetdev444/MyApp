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
    <div className="min-h-screen bg-charcoal">
      {/* Navigation */}
      <nav className="bg-charcoal shadow-lg border-b border-charcoal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-playfair font-bold text-champagne">WedSimplify</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-champagne hover:text-rose-gold hover:bg-rose-gold/20 border border-champagne/30 hover:border-rose-gold/60 transition-all duration-200"
                    data-testid="button-login"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-rose-gold/5 border border-rose-gold/20">
                  <DialogHeader>
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-rose-gold to-dusty-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <LogIn className="w-8 h-8 text-white" />
                      </div>
                      <DialogTitle className="text-3xl font-playfair text-charcoal mb-2">Welcome Back</DialogTitle>
                      <p className="text-charcoal/60">Sign in to continue your journey</p>
                    </div>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="login-email" className="text-charcoal font-semibold">Email Address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        className="h-12 border-2 border-rose-gold/20 focus:border-rose-gold focus:ring-rose-gold/20 bg-white shadow-sm"
                        data-testid="input-login-email"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="login-password" className="text-charcoal font-semibold">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="h-12 border-2 border-rose-gold/20 focus:border-rose-gold focus:ring-rose-gold/20 bg-white shadow-sm"
                        data-testid="input-login-password"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-rose-gold to-dusty-blue hover:from-rose-gold/90 hover:to-dusty-blue/90 text-white font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                      data-testid="button-submit-login"
                    >
                      <Heart className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                    <div className="text-center p-4 bg-gradient-to-r from-blush/20 to-champagne/20 rounded-lg border border-rose-gold/10">
                      <p className="text-charcoal/70 text-sm">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          className="text-rose-gold hover:text-dusty-blue font-semibold hover:underline transition-colors"
                          onClick={() => {
                            setLoginOpen(false);
                            setSignUpOpen(true);
                          }}
                          data-testid="link-switch-to-signup"
                        >
                          Create your account →
                        </button>
                      </p>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-dusty-blue to-sage hover:from-dusty-blue/90 hover:to-sage/90 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    data-testid="button-signup"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white via-champagne/5 to-dusty-blue/5 border border-dusty-blue/20 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-dusty-blue via-rose-gold to-sage rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <UserPlus className="w-10 h-10 text-white" />
                      </div>
                      <DialogTitle className="text-3xl font-playfair text-charcoal mb-2">Join WedSimplify</DialogTitle>
                      <p className="text-charcoal/60">Start your journey to unforgettable moments</p>
                    </div>
                  </DialogHeader>
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="signup-firstname" className="text-charcoal font-semibold">First Name</Label>
                        <Input
                          id="signup-firstname"
                          placeholder="First name"
                          value={signUpData.firstName}
                          onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                          required
                          className="h-11 border-2 border-dusty-blue/20 focus:border-dusty-blue focus:ring-dusty-blue/20 bg-white shadow-sm"
                          data-testid="input-signup-firstname"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="signup-lastname" className="text-charcoal font-semibold">Last Name</Label>
                        <Input
                          id="signup-lastname"
                          placeholder="Last name"
                          value={signUpData.lastName}
                          onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                          required
                          className="h-11 border-2 border-dusty-blue/20 focus:border-dusty-blue focus:ring-dusty-blue/20 bg-white shadow-sm"
                          data-testid="input-signup-lastname"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="signup-email" className="text-charcoal font-semibold">Email Address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                        className="h-11 border-2 border-sage/20 focus:border-sage focus:ring-sage/20 bg-white shadow-sm"
                        data-testid="input-signup-email"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="signup-role" className="text-charcoal font-semibold">I am a...</Label>
                      <Select 
                        value={signUpData.role} 
                        onValueChange={(value) => setSignUpData({ ...signUpData, role: value })}
                        required
                      >
                        <SelectTrigger className="h-11 border-2 border-champagne/20 focus:border-champagne focus:ring-champagne/20 bg-white shadow-sm" data-testid="select-signup-role">
                          <SelectValue placeholder="Choose what describes you best" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-champagne/20">
                          <SelectItem value="couple" className="focus:bg-rose-gold/10 focus:text-rose-gold">
                            💕 Couple planning a wedding
                          </SelectItem>
                          <SelectItem value="individual" className="focus:bg-dusty-blue/10 focus:text-dusty-blue">
                            🎉 Individual looking for services
                          </SelectItem>
                          <SelectItem value="vendor" className="focus:bg-sage/10 focus:text-sage">
                            ✨ Vendor/Service provider
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="signup-password" className="text-charcoal font-semibold">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          required
                          className="h-11 border-2 border-rose-gold/20 focus:border-rose-gold focus:ring-rose-gold/20 bg-white shadow-sm"
                          data-testid="input-signup-password"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="signup-confirm-password" className="text-charcoal font-semibold">Confirm Password</Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Confirm password"
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                          required
                          className="h-11 border-2 border-rose-gold/20 focus:border-rose-gold focus:ring-rose-gold/20 bg-white shadow-sm"
                          data-testid="input-signup-confirm-password"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-sage via-dusty-blue to-rose-gold hover:from-sage/90 hover:via-dusty-blue/90 hover:to-rose-gold/90 text-white font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                      data-testid="button-submit-signup"
                    >
                      <Sparkles className="mr-2 h-6 w-6" />
                      Create My Account
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                    
                    <div className="text-center p-4 bg-gradient-to-r from-sage/10 via-dusty-blue/10 to-rose-gold/10 rounded-lg border border-dusty-blue/20">
                      <p className="text-charcoal/70 text-sm">
                        Already have an account?{' '}
                        <button
                          type="button"
                          className="text-dusty-blue hover:text-rose-gold font-semibold hover:underline transition-colors"
                          onClick={() => {
                            setSignUpOpen(false);
                            setLoginOpen(true);
                          }}
                          data-testid="link-switch-to-login"
                        >
                          Sign in here →
                        </button>
                      </p>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-charcoal via-rose-gold/20 to-charcoal overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-rose-gold/40 to-charcoal/80"></div>
        
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
                  className="bg-gradient-to-r from-rose-gold via-dusty-blue to-sage text-white hover:from-rose-gold/90 hover:via-dusty-blue/90 hover:to-sage/90 px-10 py-6 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-start-planning-hero"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Start Planning Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-charcoal/30 backdrop-blur text-white border-rose-gold/50 hover:bg-charcoal/50 hover:text-white px-8 py-6 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-200"
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
      <section className="bg-gradient-to-b from-charcoal to-charcoal/95 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-champagne mb-4">
            Everything You Need for Any Special Occasion
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Whether you're a couple planning your wedding, an individual organizing a celebration, or a vendor looking to grow your business, 
            WedSimplify is your one-stop marketplace for all event services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-rose-gold/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-charcoal/80 to-rose-gold/20" data-testid="card-vendor-discovery">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-gold to-rose-gold/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-playfair">Find Your Dream Team</h3>
              <p className="text-white/80 leading-relaxed">
                💕 Discover handpicked vendors who'll bring your vision to life. From photographers who capture pure joy to caterers who create magic.
              </p>
              <div className="mt-4 text-rose-gold font-semibold">Browse 1,200+ vendors</div>
            </CardContent>
          </Card>

          <Card className="border-sage/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-charcoal/80 to-sage/20" data-testid="card-portfolio-showcase">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sage to-sage/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-playfair">Showcase Excellence</h3>
              <p className="text-white/80 leading-relaxed">
                ✨ Vendors, let your artistry shine! Create stunning galleries that make couples fall in love with your work at first sight.
              </p>
              <div className="mt-4 text-sage font-semibold">Join 1,200+ professionals</div>
            </CardContent>
          </Card>

          <Card className="border-dusty-blue/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-charcoal/80 to-dusty-blue/20" data-testid="card-event-planning">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-dusty-blue to-dusty-blue/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-playfair">Plan Like a Pro</h3>
              <p className="text-white/80 leading-relaxed">
                📅 Turn chaos into celebration! Our tools help you organize every precious moment, from first dance to final toast.
              </p>
              <div className="mt-4 text-dusty-blue font-semibold">Stay perfectly organized</div>
            </CardContent>
          </Card>

          <Card className="border-champagne/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-charcoal/80 to-champagne/20" data-testid="card-budget-tracking">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-champagne to-champagne/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-playfair">Budget Bliss</h3>
              <p className="text-white/80 leading-relaxed">
                💰 Spend smart, celebrate more! Track every penny while ensuring your special day is everything you dreamed of.
              </p>
              <div className="mt-4 text-champagne font-semibold">Save an average $2,800</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-charcoal/90 to-charcoal/80 rounded-3xl p-12 mx-auto max-w-4xl border border-rose-gold/40 shadow-2xl">
            <h3 className="text-3xl font-playfair font-bold text-champagne mb-4">
              Ready to Create Something Beautiful?
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
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
            <p className="text-sm text-white/70 mt-4">Free to join • No credit card required</p>
          </div>
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
