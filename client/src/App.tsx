import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/landing";
import CoupleDashboard from "./pages/couple-dashboard";
import VendorDashboard from "./pages/vendor-dashboard";
import VendorProfile from "./pages/vendor-profile";
import VendorBrowse from "./pages/vendor-browse";
import NotFound from "./pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gray">
        <div className="animate-spin w-8 h-8 border-4 border-rose-gold border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {user?.role === 'couple' && <Route path="/" component={CoupleDashboard} />}
          {user?.role === 'vendor' && <Route path="/" component={VendorDashboard} />}
          <Route path="/vendors" component={VendorBrowse} />
          <Route path="/vendor/:vendorId" component={VendorProfile} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
