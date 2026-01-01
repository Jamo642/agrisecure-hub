import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Tractor, 
  ShoppingCart, 
  Store, 
  Scan, 
  Wallet, 
  MessageSquare, 
  Package,
  TrendingUp,
  Users,
  LogOut
} from 'lucide-react';
import { ImageScanner } from '@/components/ImageScanner';
import { FinancialManager } from '@/components/FinancialManager';
import { Marketplace } from '@/components/Marketplace';
import { AIChatbot } from '@/components/AIChatbot';

export default function EnhancedDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('agrinova_token');
    const userData = localStorage.getItem('agrinova_user');
    
    if (!token || !userData) {
      setLoading(false);
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agrinova_token');
    localStorage.removeItem('agrinova_user');
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getUserTypeIcon = () => {
    switch (user.userType) {
      case 'farmer': return Tractor;
      case 'buyer': return ShoppingCart;
      case 'seller': return Store;
      default: return Users;
    }
  };

  const UserIcon = getUserTypeIcon();

  const getUserFeatures = () => {
    const common = [
      { key: 'marketplace', label: 'Marketplace', icon: Package, description: 'Buy & Sell Products' },
      { key: 'finance', label: 'Finance', icon: Wallet, description: 'Track Transactions' },
      { key: 'chatbot', label: 'AI Assistant', icon: MessageSquare, description: 'Get Help' }
    ];

    if (user.userType === 'farmer') {
      return [
        { key: 'scanner', label: 'Disease Scanner', icon: Scan, description: 'AI Detection' },
        ...common
      ];
    }

    if (user.userType === 'seller') {
      return [
        { key: 'products', label: 'My Products', icon: Package, description: 'Manage Listings' },
        ...common
      ];
    }

    return common;
  };

  const features = getUserFeatures();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">AgriNova</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <UserIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium capitalize">{user.userType}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  Wallet: KES {user.walletBalance?.toLocaleString() || '0'}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.fullName}!</h2>
          <p className="text-muted-foreground">
            Manage your agricultural operations with AI-powered tools
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">KES {user.walletBalance?.toLocaleString() || '0'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {user.userType === 'farmer' ? 'Scans Done' : 'Active Listings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">KES 0</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Features Tabs */}
        <Tabs defaultValue={features[0].key} className="space-y-6">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${features.length}, 1fr)` }}>
            {features.map(feature => (
              <TabsTrigger key={feature.key} value={feature.key} className="flex items-center gap-2">
                <feature.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{feature.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {user.userType === 'farmer' && (
            <TabsContent value="scanner">
              <ImageScanner />
            </TabsContent>
          )}

          <TabsContent value="marketplace">
            <Marketplace />
          </TabsContent>

          <TabsContent value="finance">
            <FinancialManager />
          </TabsContent>

          <TabsContent value="chatbot">
            <AIChatbot />
          </TabsContent>

          {user.userType === 'seller' && (
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>My Products</CardTitle>
                  <CardDescription>Manage your product listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Product management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Security Badge */}
        <div className="mt-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Blockchain Secured</p>
                  <p className="text-sm text-muted-foreground">
                    All your transactions are protected with blockchain technology
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
