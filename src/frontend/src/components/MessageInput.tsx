import { useState } from 'react';
import { useSendMessage } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import type { UserProfile } from '../backend';

interface MessageInputProps {
  selectedMember: UserProfile | null;
}

export function MessageInput({ selectedMember }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedMember || sendMessage.isPending) return;

    const messageContent = message.trim();
    // Clear immediately for instant feedback
    setMessage('');

    sendMessage.mutate(
      {
        recipientID: selectedMember.userID.toString(),
        content: messageContent,
      },
      {
        onError: () => {
          // Restore message on error
          setMessage(messageContent);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedMember ? `Message ${selectedMember.username}...` : 'Select a member to chat'}
          disabled={!selectedMember}
          className="min-h-[60px] max-h-[120px] resize-none"
          rows={2}
        />
        <Button
          type="submit"
          disabled={!message.trim() || !selectedMember || sendMessage.isPending}
          size="icon"
          className="h-[60px] w-[60px] shrink-0 touch-manipulation"
        >
          {sendMessage.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
