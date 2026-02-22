import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Loader2, LogIn } from 'lucide-react';
import { useRegisterUser, useUserProfile } from '../hooks/useQueries';

export function AuthScreen() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const registerUser = useRegisterUser();
  const [username, setUsername] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      registerUser.mutate(username.trim());
    }
  };

  // Show registration form if logged in but not registered
  if (identity && !isLoadingProfile && !userProfile) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-warm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Family Chat!</CardTitle>
            <CardDescription>Choose a username to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={registerUser.isPending}
                  className="text-base"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!username.trim() || registerUser.isPending}
              >
                {registerUser.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Continue'
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
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <img 
              src="/assets/generated/chat-logo.dim_128x128.png" 
              alt="Family Chat" 
              className="w-24 h-24 mx-auto rounded-full shadow-warm"
            />
          </div>
          <div>
            <CardTitle className="text-3xl">Family Chat</CardTitle>
            <CardDescription className="text-base mt-2">
              Connect with your family members in a simple, secure way
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
                Sign In
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
