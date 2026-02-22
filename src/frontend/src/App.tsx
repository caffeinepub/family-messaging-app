import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useUserProfile } from './hooks/useQueries';
import { Layout } from './components/Layout';
import { AuthScreen } from './components/AuthScreen';
import { ChatView } from './components/ChatView';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  if (isInitializing) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Show auth screen if not logged in or not registered
  if (!identity || !userProfile) {
    return (
      <Layout>
        <AuthScreen />
      </Layout>
    );
  }

  // Show chat interface
  return (
    <Layout>
      <ChatView />
    </Layout>
  );
}
