import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Smartphone } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface OTPVerificationProps {
  userId: string;
  otpMethod: 'email' | 'sms';
  onVerified: (token: string, user: any) => void;
  onBack: () => void;
}

export function OTPVerification({ userId, otpMethod, onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit code',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-login-otp', {
        userId,
        otp
      });

      if (response.data.success) {
        toast({
          title: 'Success!',
          description: 'Login successful'
        });
        onVerified(response.data.token, response.data.user);
      } else {
        toast({
          title: 'Verification failed',
          description: response.data.message,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Verification failed',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const resendOTP = async () => {
    setResending(true);
    try {
      const response = await apiClient.post('/auth/resend-otp', {
        userId,
        method: otpMethod
      });

      if (response.data.success) {
        toast({
          title: 'OTP Resent',
          description: `A new code has been sent to your ${otpMethod}`
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend OTP',
        variant: 'destructive'
      });
    }
    setResending(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify OTP</CardTitle>
        <CardDescription>
          {otpMethod === 'email' ? (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Check your email for the verification code
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Check your phone for the SMS code
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Verification Code</Label>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter the 6-digit code sent to your {otpMethod}
          </p>
        </div>

        <Button onClick={verifyOTP} className="w-full" disabled={loading || otp.length !== 6}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify & Login
        </Button>

        <div className="flex items-center justify-between text-sm">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-primary"
          >
            ← Back
          </button>
          <button
            onClick={resendOTP}
            disabled={resending}
            className="text-primary hover:underline"
          >
            {resending ? 'Resending...' : 'Resend Code'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

interface EnhancedAuthProps {
  mode?: 'login' | 'register';
}

export default function EnhancedAuth({ mode: initialMode = 'login' }: EnhancedAuthProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>(initialMode);
  const [userType, setUserType] = useState<'farmer' | 'buyer' | 'seller'>('farmer');
  const [otpMethod, setOtpMethod] = useState<'email' | 'sms'>('email');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    emailOrPhone: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        userType: userType,
        otpMethod: otpMethod
      });

      if (response.data.success) {
        setUserId(response.data.userId);
        setMode('verify');
        toast({
          title: 'Registration Successful!',
          description: `Please check your ${otpMethod} for the verification code`
        });
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        otpMethod: otpMethod
      });

      if (response.data.success) {
        setUserId(response.data.userId);
        setMode('verify');
        toast({
          title: 'OTP Sent',
          description: `Please check your ${otpMethod} for the verification code`
        });
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleVerified = (token: string, user: any) => {
    localStorage.setItem('agrinova_token', token);
    localStorage.setItem('agrinova_user', JSON.stringify(user));
    navigate('/dashboard');
  };

  if (mode === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <OTPVerification
            userId={userId}
            otpMethod={otpMethod}
            onVerified={handleVerified}
            onBack={() => setMode(initialMode)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">AgriNova</h1>
          <p className="text-muted-foreground mt-2">Empowering Kenyan Agriculture</p>
        </div>

        {mode === 'register' ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join AgriNova and transform your farming experience</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label>User Type</Label>
                  <Select value={userType} onValueChange={(v: any) => setUserType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller (Inputs & Services)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Kamau"
                    required
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+254700123456"
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <Label>Receive OTP via</Label>
                  <Select value={otpMethod} onValueChange={(v: any) => setOtpMethod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary hover:underline">
                  Sign in
                </button>
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your AgriNova account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Email or Phone Number</Label>
                  <Input
                    value={formData.emailOrPhone}
                    onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                    placeholder="john@example.com or +254700123456"
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <Label>Receive OTP via</Label>
                  <Select value={otpMethod} onValueChange={(v: any) => setOtpMethod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-primary hover:underline">
                  Sign up
                </button>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
