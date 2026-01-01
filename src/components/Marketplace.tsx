import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Phone, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api';

export function Marketplace() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [productType, setProductType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [productType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (productType) params.productType = productType;
      if (search) params.search = search;

      const response = await apiClient.get('/products', { params });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agricultural Marketplace</CardTitle>
          <CardDescription>Buy and sell agricultural products, inputs, and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchProducts}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" onValueChange={setProductType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="">All</TabsTrigger>
          <TabsTrigger value="crop">Crops</TabsTrigger>
          <TabsTrigger value="fertilizer">Fertilizers</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="service">Services</TabsTrigger>
        </TabsList>

        <TabsContent value={productType} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              products.map((product: any) => (
                <Card key={product._id}>
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </div>
                      <Badge>{product.productType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="text-lg font-bold text-primary">
                        KES {product.price.toLocaleString()}/{product.unit}
                      </span>
                    </div>
                    {product.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {product.location.county}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {product.sellerId?.phoneNumber}
                    </div>
                    <Button className="w-full" variant="outline">
                      Contact Seller
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
