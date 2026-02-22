import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Message } from '../backend';
import { Principal } from '@dfinity/principal';

export function useUserProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getUserProfile();
      } catch (error) {
        // User not registered yet
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.registerUser(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
    },
  });
}

export function useFamilyMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['familyMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getFamilyMemberList();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getMessages();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000, // Poll every 2 seconds for faster updates
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipientID, content }: { recipientID: string; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const principal = Principal.fromText(recipientID);
      const timestamp = BigInt(Date.now());
      await actor.sendMessage(principal, content, timestamp);
    },
    onMutate: async () => {
      // Optimistic update - immediately refetch to show sending state
      await queryClient.cancelQueries({ queryKey: ['messages'] });
    },
    onSuccess: () => {
      // Invalidate to fetch the actual message from backend
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => {
      // Refetch on error to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useClearMessages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.clearMessages();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}
