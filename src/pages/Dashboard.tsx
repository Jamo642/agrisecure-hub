import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Tractor, ShoppingCart, Package, TrendingUp, Bot, Users, Camera, MessageSquare } from 'lucide-react';
import { ROLE_LABELS } from '@/types/auth';

export default function Dashboard() {
  const { user, profile, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const isFarmer = role === 'farmer_large' || role === 'farmer_small';
  const canSell = isFarmer || role === 'seller';

  const getDashboardContent = () => {
    switch (role) {
      case 'farmer_large':
      case 'farmer_small':
        return {
          title: role === 'farmer_large' ? 'Large Scale Farm Dashboard' : 'Small Scale Farm Dashboard',
          cards: [
            { icon: Tractor, title: 'My Farms', value: '0', desc: 'Active farms' },
            { icon: Bot, title: 'AI Scans', value: '0', desc: 'Disease detections' },
            { icon: Package, title: 'Products', value: '0', desc: 'Listed for sale' },
            { icon: TrendingUp, title: 'Revenue', value: 'KES 0', desc: 'This month' },
          ],
        };
      case 'buyer':
        return {
          title: 'Buyer Dashboard',
          cards: [
            { icon: ShoppingCart, title: 'Orders', value: '0', desc: 'Total orders' },
            { icon: Package, title: 'Pending', value: '0', desc: 'Awaiting delivery' },
            { icon: Users, title: 'Sellers', value: '0', desc: 'Trusted sellers' },
            { icon: TrendingUp, title: 'Spent', value: 'KES 0', desc: 'This month' },
          ],
        };
      case 'seller':
        return {
          title: 'Seller Dashboard',
          cards: [
            { icon: Package, title: 'Products', value: '0', desc: 'Active listings' },
            { icon: ShoppingCart, title: 'Orders', value: '0', desc: 'Pending orders' },
            { icon: Users, title: 'Customers', value: '0', desc: 'Total buyers' },
            { icon: TrendingUp, title: 'Sales', value: 'KES 0', desc: 'This month' },
          ],
        };
      default:
        return { title: 'Dashboard', cards: [] };
    }
  };

  const content = getDashboardContent();

  return (
    <MainLayout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || 'User'}!</h1>
          <p className="text-muted-foreground">{role ? ROLE_LABELS[role] : 'User'} • {profile?.county || 'Kenya'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {content.cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild><Link to="/marketplace"><ShoppingCart className="h-4 w-4 mr-2" />Marketplace</Link></Button>
            <Button asChild variant="outline"><Link to="/ai-chat"><MessageSquare className="h-4 w-4 mr-2" />AI Assistant</Link></Button>
            {isFarmer && <Button asChild variant="outline"><Link to="/disease-scanner"><Camera className="h-4 w-4 mr-2" />Disease Scanner</Link></Button>}
            {canSell && <Button asChild variant="outline"><Link to="/products"><Package className="h-4 w-4 mr-2" />My Products</Link></Button>}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}