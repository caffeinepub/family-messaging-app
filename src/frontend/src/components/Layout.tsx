import { ReactNode } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { Sprout, ShoppingCart as CartIcon, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { CartIconBadge } from './CartIcon';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingOut = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate({ to: '/' })}
            >
              <img 
                src="/assets/generated/logo.dim_200x200.png" 
                alt="Bhai Bhai Fertilizer" 
                className="w-12 h-12 rounded-lg shadow-agricultural"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Bhai Bhai Fertilizer</h1>
                <p className="text-xs text-muted-foreground">Quality Agricultural Products</p>
              </div>
            </div>

            {isAuthenticated && (
              <nav className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/' })}
                  className="hidden sm:flex"
                >
                  Products
                </Button>
                <CartIconBadge />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate({ to: '/profile' })}
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children || <Outlet />}
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sprout className="h-4 w-4 text-primary" />
              <span>Growing Together, Harvesting Success</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Bhai Bhai Fertilizer · Built with{' '}
              <span className="text-primary">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
