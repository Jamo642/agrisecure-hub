import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Loader2, Leaf, Bug, AlertTriangle, CheckCircle, History, X } from 'lucide-react';

interface ScanResult {
  diagnosis: string;
  confidence: number;
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
  isHealthy: boolean;
}

export default function DiseaseScanner() {
  const { user, role, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanType, setScanType] = useState<'crop' | 'livestock'>('crop');

  const isFarmer = role === 'farmer_large' || role === 'farmer_small';

  const { data: scanHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['ai-scans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('ai_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const scanMutation = useMutation({
    mutationFn: async ({ imageBase64, type }: { imageBase64: string; type: string }) => {
      const { data, error } = await supabase.functions.invoke('disease-scanner', {
        body: { image: imageBase64, scan_type: type },
      });
      if (error) throw error;
      return data as ScanResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-scans'] });
      toast({ title: 'Scan complete!' });
    },
    onError: (error: any) => {
      const message = error?.message || 'Scan failed';
      if (message.includes('Rate limit')) {
        toast({ title: 'Too many requests', description: 'Please wait a moment and try again.', variant: 'destructive' });
      } else if (message.includes('Payment required')) {
        toast({ title: 'AI credits exhausted', description: 'Please add credits to continue using AI features.', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: message, variant: 'destructive' });
      }
    },
  });

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

  if (!isFarmer) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    if (!selectedImage) return;
    scanMutation.mutate({ imageBase64: selectedImage, type: scanType });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <MainLayout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Disease Scanner</h1>
          <p className="text-muted-foreground">
            Upload a photo of your crop or livestock for instant disease detection and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className="space-y-6">
            <Tabs value={scanType} onValueChange={(v) => setScanType(v as 'crop' | 'livestock')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crop">
                  <Leaf className="h-4 w-4 mr-2" />
                  Crop Disease
                </TabsTrigger>
                <TabsTrigger value="livestock">
                  <Bug className="h-4 w-4 mr-2" />
                  Livestock Health
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crop" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Disease Detection</CardTitle>
                    <CardDescription>
                      Take or upload a clear photo of the affected plant leaves, stems, or fruits
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="livestock" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Livestock Health Check</CardTitle>
                    <CardDescription>
                      Upload a photo showing the symptoms or affected area of your animal
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Image Upload Area */}
            <Card className="border-dashed">
              <CardContent className="pt-6">
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-64 object-contain rounded-lg bg-muted"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Click to upload or take a photo</p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleScan}
                    disabled={!selectedImage || scanMutation.isPending}
                  >
                    {scanMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Scan Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scan Result */}
            {scanMutation.data && (
              <Card className={scanMutation.data.isHealthy ? 'border-green-500' : 'border-destructive'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {scanMutation.data.isHealthy ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      Scan Result
                    </CardTitle>
                    {!scanMutation.data.isHealthy && (
                      <Badge variant={getSeverityColor(scanMutation.data.severity)}>
                        {scanMutation.data.severity} severity
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Diagnosis</h4>
                    <p className="text-muted-foreground">{scanMutation.data.diagnosis}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Confidence: {Math.round(scanMutation.data.confidence * 100)}%
                    </p>
                  </div>

                  {scanMutation.data.treatment.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommended Treatment</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {scanMutation.data.treatment.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scanMutation.data.prevention.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Prevention Tips</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {scanMutation.data.prevention.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* History Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Scan History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : scanHistory && scanHistory.length > 0 ? (
                  <div className="space-y-4">
                    {scanHistory.map((scan) => {
                      const result = scan.result as unknown as ScanResult | null;
                      return (
                        <div key={scan.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                          {scan.image_url && (
                            <img
                              src={scan.image_url}
                              alt="Scan"
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{scan.scan_type}</Badge>
                              {result && !result.isHealthy && (
                                <Badge variant={getSeverityColor(result.severity)}>
                                  {result.severity}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium truncate">
                              {result?.diagnosis || 'Processing...'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(scan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No scans yet</p>
                    <p className="text-sm text-muted-foreground">Your scan history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
