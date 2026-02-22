import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart } from '../hooks/useQueries';
import { Badge } from './ui/badge';

export function CartIconBadge() {
  const navigate = useNavigate();
  const { data: cart } = useGetCart();

  const itemCount = cart?.items.length || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate({ to: '/cart' })}
      className="relative"
      title="Shopping Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
}
