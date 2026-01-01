import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ImageScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [scanType, setScanType] = useState<'crop' | 'livestock'>('crop');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive'
        });
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('scanType', scanType);

      const response = await apiClient.post('/scan-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setResult(response.data.analysis);
        toast({
          title: 'Scan Complete',
          description: 'Disease detection results ready'
        });
      } else {
        toast({
          title: 'Scan Failed',
          description: response.data.message,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to scan image',
        variant: 'destructive'
      });
    }

    setScanning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Disease Detection</CardTitle>
          <CardDescription>
            Upload an image of your crop or animal to detect diseases and get recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Scan Type</Label>
            <Select value={scanType} onValueChange={(v: any) => setScanType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crop">Crop/Plant</SelectItem>
                <SelectItem value="livestock">Livestock/Animal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Upload Image</Label>
            <div className="mt-2 flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex-1 cursor-pointer border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Button
            onClick={handleScan}
            disabled={!selectedFile || scanning}
            className="w-full"
          >
            {scanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Scan Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success ? (
              <>
                <div>
                  <Label>Detected Category</Label>
                  <p className="text-lg font-semibold capitalize">{result.detectedCategory}</p>
                </div>

                <div>
                  <Label>Diagnosis</Label>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{result.diagnosis.disease}</AlertTitle>
                    <AlertDescription>
                      <div className="space-y-1 mt-2">
                        <p>Confidence: {(result.diagnosis.confidence * 100).toFixed(0)}%</p>
                        <p>Severity: <span className="capitalize font-semibold">{result.diagnosis.severity}</span></p>
                        <p>Affected Area: {result.diagnosis.affectedArea}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <Label>Recommendations</Label>
                  <div className="space-y-2 mt-2">
                    {result.recommendations.map((rec: any, idx: number) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <h4 className="font-semibold">{rec.type}</h4>
                          <p className="text-sm text-muted-foreground">Product: {rec.product}</p>
                          <p className="text-sm text-muted-foreground">Dosage: {rec.dosage}</p>
                          <p className="text-sm text-muted-foreground">Timing: {rec.timing}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cannot Scan Image</AlertTitle>
                <AlertDescription>
                  {result.message || 'The image does not contain recognizable crops or animals. Please upload a clear photo of the affected plant or animal.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
