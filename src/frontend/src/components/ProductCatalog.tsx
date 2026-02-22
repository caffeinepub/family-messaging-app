import { useGetAllProducts } from '../hooks/useQueries';
import { ProductCard } from './ProductCard';
import { HeroSection } from './HeroSection';
import { Loader2, Package } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function ProductCatalog() {
  const { data: products, isLoading, error } = useGetAllProducts();

  return (
    <div className="flex-1">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Our Products</h2>
          <p className="text-muted-foreground">Browse our selection of premium fertilizers</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load products. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Products Available</h3>
            <p className="text-muted-foreground">Check back soon for new products!</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} productId={`product-${index}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
