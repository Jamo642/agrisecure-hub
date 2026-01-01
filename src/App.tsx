import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Products from "./pages/Products";
import DiseaseScanner from "./pages/DiseaseScanner";
import AIChat from "./pages/AIChat";
import EnhancedAuth from "./pages/EnhancedAuth";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/new" element={<EnhancedAuth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/enhanced" element={<EnhancedDashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/products" element={<Products />} />
            <Route path="/disease-scanner" element={<DiseaseScanner />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
