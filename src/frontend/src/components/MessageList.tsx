import { useEffect, useRef } from 'react';
import { useMessages, useUserProfile } from '../hooks/useQueries';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Loader2, MessageSquare } from 'lucide-react';
import type { UserProfile } from '../backend';

interface MessageListProps {
  selectedMember: UserProfile | null;
}

export function MessageList({ selectedMember }: MessageListProps) {
  const { data: messages, isLoading } = useMessages();
  const { data: currentUser } = useUserProfile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  // Filter messages for the selected conversation
  const conversationMessages = messages?.filter((msg) => {
    if (!selectedMember || !currentUser) return false;
    const isSentToSelected = msg.sender.toString() === currentUser.userID.toString() &&
      selectedMember.userID.toString() === selectedMember.userID.toString();
    const isReceivedFromSelected = msg.sender.toString() === selectedMember.userID.toString();
    return isSentToSelected || isReceivedFromSelected;
  }) || [];

  // Auto-scroll to bottom when messages change - smooth for new messages
  useEffect(() => {
    if (scrollRef.current) {
      const isNewMessage = conversationMessages.length > prevMessageCountRef.current;
      prevMessageCountRef.current = conversationMessages.length;
      
      if (isNewMessage) {
        // Smooth scroll for new messages
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        // Instant scroll for initial load or member change
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [conversationMessages.length]);

  if (!selectedMember) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No conversation selected</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Select a family member from the list to start chatting
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollRef}>
      <div className="py-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          conversationMessages.map((message, index) => {
            const isCurrentUser = message.sender.toString() === currentUser?.userID.toString();
            const showDate = index === 0 || 
              formatDate(conversationMessages[index - 1].timestamp) !== formatDate(message.timestamp);

            const senderInitials = isCurrentUser
              ? currentUser?.username.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
              : selectedMember.username.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

            return (
              <div key={`${message.timestamp}-${index}`} className="animate-slide-in">
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                <div className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="h-8 w-8 mt-1 shrink-0">
                    <AvatarFallback className={isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                      {senderInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`message-bubble ${isCurrentUser ? 'message-sent' : 'message-received'}`}>
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
