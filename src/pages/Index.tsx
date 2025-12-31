import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, ShoppingCart, TrendingUp, Smartphone, Bot, Shield, Tractor, Users, BarChart3 } from 'lucide-react';

export default function Index() {
  const features = [
    { icon: Tractor, title: 'Farm Management', desc: 'Track crops, livestock, and finances in one place' },
    { icon: Bot, title: 'AI Disease Detection', desc: 'Scan crops & animals for instant diagnosis' },
    { icon: ShoppingCart, title: 'Marketplace', desc: 'Buy and sell produce, equipment, and services' },
    { icon: TrendingUp, title: 'Live Market Prices', desc: 'Real-time prices from major Kenyan markets' },
    { icon: Smartphone, title: 'USSD Access', desc: 'Works on any phone, no internet needed' },
    { icon: Shield, title: 'Secure Payments', desc: 'M-Pesa, bank transfers, and blockchain security' },
  ];

  const stats = [
    { value: '47', label: 'Counties Covered' },
    { value: '10K+', label: 'Active Farmers' },
    { value: '500+', label: 'Products Listed' },
    { value: '24/7', label: 'AI Support' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf size={16} />
              Kenya's #1 Agricultural Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Grow Smarter with <span className="text-primary">AgriNova</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with buyers, access real-time market prices, detect crop diseases with AI, 
              and manage your farm - all from your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/auth?mode=signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a farmer, buyer, or seller - AgriNova has the tools you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Everyone</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Tractor, title: 'Farmers', desc: 'Manage farms, scan for diseases, access markets', color: 'bg-primary' },
              { icon: Users, title: 'Buyers', desc: 'Find quality produce, fair prices, trusted sellers', color: 'bg-secondary' },
              { icon: BarChart3, title: 'Sellers', desc: 'List products, manage inventory, grow sales', color: 'bg-accent' },
            ].map((role) => (
              <Card key={role.title} className="text-center p-6">
                <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <role.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{role.title}</h3>
                <p className="text-muted-foreground">{role.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Farming?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of Kenyan farmers already using AgriNova.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link to="/auth?mode=signup">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}