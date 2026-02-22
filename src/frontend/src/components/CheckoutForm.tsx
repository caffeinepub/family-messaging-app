import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useGetCallerUserProfile, useCheckout } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

export function CheckoutForm() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: userProfile } = useGetCallerUserProfile();
  const checkout = useCheckout();

  const [shippingAddress, setShippingAddress] = useState(userProfile?.shippingAddress || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    try {
      await checkout.mutateAsync();
      navigate({ to: '/confirmation' });
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  if (cartLoading) {
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
              Add products to your cart before checking out
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
        <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-agricultural">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={userProfile?.name || ''}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile?.email || ''}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-agricultural">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {checkout.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Checkout failed. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-agricultural">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cart.items.map((item, index) => {
                      const itemPrice = Number(item.product.price);
                      const quantity = Number(item.quantity);
                      const itemTotal = itemPrice * quantity;

                      return (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate mr-2">
                            {item.product.name} × {quantity}
                          </span>
                          <span className="font-medium">₹{itemTotal}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </CardContent>
                <CardContent className="pt-0">
                  <Button 
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={checkout.isPending || !shippingAddress.trim()}
                  >
                    {checkout.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
