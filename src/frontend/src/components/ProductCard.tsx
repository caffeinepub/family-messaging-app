import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { useAddItemToCart } from '../hooks/useQueries';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  productId: string;
}

export function ProductCard({ product, productId }: ProductCardProps) {
  const addToCart = useAddItemToCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({ productId, quantity: BigInt(1) });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const imageUrl = product.image.getDirectURL();
  const price = Number(product.price);

  return (
    <Card className="overflow-hidden hover:shadow-agricultural transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/product-placeholder.dim_400x400.png';
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {product.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">₹{price}</span>
          <span className="text-sm text-muted-foreground">per unit</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={addToCart.isPending || showSuccess}
          className="w-full"
        >
          {addToCart.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : showSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
