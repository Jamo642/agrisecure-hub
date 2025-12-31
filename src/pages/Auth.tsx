import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AppRole, KENYAN_COUNTIES, ROLE_LABELS, SELLER_TYPE_LABELS, BUYER_TYPE_LABELS, SellerType, BuyerType } from '@/types/auth';
import { Loader2, Tractor, ShoppingCart, Store, ArrowLeft } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  county: z.string().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup' | 'role-select'>(
    searchParams.get('mode') === 'signup' ? 'role-select' : 'signin'
  );
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [subType, setSubType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const signInForm = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });
  const signUpForm = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const handleSignIn = async (data: SignInValues) => {
    setLoading(true);
    const { error } = await signIn(data.email, data.password);
    setLoading(false);
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back!' });
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (data: SignUpValues) => {
    if (!selectedRole) return;
    setLoading(true);
    
    const { error } = await signUp({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      phone: data.phone,
      county: data.county,
      role: selectedRole,
      farmer_type: selectedRole === 'farmer_large' ? 'large_scale' : selectedRole === 'farmer_small' ? 'small_scale' : undefined,
      seller_type: selectedRole === 'seller' ? (subType as SellerType) : undefined,
      buyer_type: selectedRole === 'buyer' ? (subType as BuyerType) : undefined,
    });
    
    setLoading(false);
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account created!', description: 'Welcome to AgriNova!' });
      navigate('/dashboard');
    }
  };

  const roleCards = [
    { role: 'farmer_large' as AppRole, icon: Tractor, title: 'Large Scale Farmer', desc: 'Multiple farms, advanced tools' },
    { role: 'farmer_small' as AppRole, icon: Tractor, title: 'Small Scale Farmer', desc: 'Single farm, community features' },
    { role: 'buyer' as AppRole, icon: ShoppingCart, title: 'Buyer', desc: 'Purchase produce & products' },
    { role: 'seller' as AppRole, icon: Store, title: 'Seller', desc: 'Sell inputs, equipment, services' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-muted-foreground mt-2">Kenya's Agricultural Platform</p>
        </div>

        {mode === 'role-select' && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Role</CardTitle>
              <CardDescription>Select how you'll use AgriNova</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {roleCards.map((item) => (
                <button
                  key={item.role}
                  onClick={() => { setSelectedRole(item.role); setMode('signup'); }}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary hover:bg-primary/5 ${
                    selectedRole === item.role ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <item.icon className="h-6 w-6 text-primary mb-2" />
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {mode === 'signup' && selectedRole && (
          <Card>
            <CardHeader>
              <Button variant="ghost" size="sm" onClick={() => setMode('role-select')} className="w-fit mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Signing up as {ROLE_LABELS[selectedRole]}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input {...signUpForm.register('full_name')} placeholder="John Kamau" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input {...signUpForm.register('email')} type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input {...signUpForm.register('password')} type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label>Phone (Optional)</Label>
                  <Input {...signUpForm.register('phone')} placeholder="+254 700 123 456" />
                </div>
                <div>
                  <Label>County (Optional)</Label>
                  <Select onValueChange={(v) => signUpForm.setValue('county', v)}>
                    <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                    <SelectContent>
                      {KENYAN_COUNTIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {selectedRole === 'seller' && (
                  <div>
                    <Label>Seller Type</Label>
                    <Select onValueChange={setSubType}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(SELLER_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {selectedRole === 'buyer' && (
                  <div>
                    <Label>Buyer Type</Label>
                    <Select onValueChange={setSubType}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(BUYER_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} className="text-primary hover:underline">Sign in</button>
              </p>
            </CardContent>
          </Card>
        )}

        {mode === 'signin' && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input {...signInForm.register('email')} type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input {...signInForm.register('password')} type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{' '}
                <button onClick={() => setMode('role-select')} className="text-primary hover:underline">Sign up</button>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}