import { useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Package } from 'lucide-react';

export function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md text-center shadow-agricultural">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-20 w-20 text-primary" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              Thank you for your order!
            </p>
            <p className="text-sm text-muted-foreground">
              Your order has been successfully placed and will be processed soon.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <Package className="h-8 w-8 text-primary mx-auto" />
            <p className="text-sm font-medium">
              We'll contact you shortly with delivery details
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => navigate({ to: '/' })}
              className="w-full"
              size="lg"
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate({ to: '/profile' })}
              className="w-full"
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
