import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Loader2, LogIn, Sprout } from 'lucide-react';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import type { UserProfile } from '../backend';

export function AuthScreen() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shippingAddress: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      const profile: UserProfile = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        shippingAddress: formData.shippingAddress.trim(),
      };
      saveProfile.mutate(profile);
    }
  };

  // Show registration form if logged in but no profile
  const showProfileSetup = identity && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-agricultural">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Sprout className="h-12 w-12 text-primary mx-auto" />
            </div>
            <CardTitle className="text-2xl">Welcome to Bhai Bhai Fertilizer!</CardTitle>
            <CardDescription>Complete your profile to start shopping</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={saveProfile.isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={saveProfile.isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Your delivery address"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  disabled={saveProfile.isPending}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!formData.name.trim() || !formData.email.trim() || saveProfile.isPending}
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Continue to Shop'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login screen
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md shadow-agricultural">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <img 
              src="/assets/generated/logo.dim_200x200.png" 
              alt="Bhai Bhai Fertilizer" 
              className="w-24 h-24 mx-auto rounded-xl shadow-agricultural"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Bhai Bhai Fertilizer</CardTitle>
            <CardDescription className="text-base mt-2">
              Premium quality fertilizers for healthy crops and abundant harvests
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full text-base py-6"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Shop
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Secure authentication powered by Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
