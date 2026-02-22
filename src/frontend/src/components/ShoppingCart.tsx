import { useGetCart, useRemoveItemFromCart, useClearCart } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Separator } from './ui/separator';

export function ShoppingCart() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useGetCart();
  const removeItem = useRemoveItemFromCart();
  const clearCart = useClearCart();

  const handleRemoveItem = async (index: number) => {
    try {
      await removeItem.mutateAsync(BigInt(index));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart.mutateAsync();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    navigate({ to: '/checkout' });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-agricultural">
          <CardHeader>
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Start shopping to add products to your cart
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const total = Number(cart.total);

  return (
    <div className="flex-1 bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearCart}
            disabled={clearCart.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => {
              const imageUrl = item.product.image.getDirectURL();
              const itemPrice = Number(item.product.price);
              const quantity = Number(item.quantity);
              const itemTotal = itemPrice * quantity;

              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/generated/product-placeholder.dim_400x400.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              ₹{itemPrice} × {quantity}
                            </p>
                            <p className="text-lg font-bold text-primary">
                              ₹{itemTotal}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            disabled={removeItem.isPending}
                          >
                            {removeItem.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-agricultural">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({cart.items.length})</span>
                    <span className="font-medium">₹{total}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
