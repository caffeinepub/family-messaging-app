import { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { FamilyMemberList } from './FamilyMemberList';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserProfile } from '../hooks/useQueries';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import type { UserProfile } from '../backend';

export function ChatView() {
  const { clear, identity } = useInternetIdentity();
  const { data: currentUser } = useUserProfile();
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);

  return (
    <div className="flex-1 flex flex-col">
      {/* User info bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{currentUser?.username}</p>
              <p className="text-xs text-muted-foreground">
                {identity?.getPrincipal().toString().slice(0, 12)}...
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clear}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 container mx-auto flex gap-4 p-4 overflow-hidden">
        {/* Sidebar - Family members */}
        <div className="w-80 hidden md:block">
          <FamilyMemberList
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
          />
        </div>

        {/* Chat area */}
        <div 
          className="flex-1 flex flex-col rounded-lg border border-border overflow-hidden shadow-warm relative"
        >
          {/* Background with subtle overlay - no blur */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'url(/assets/generated/chat-background.dim_1200x800.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Content layer */}
          <div className="relative flex flex-col h-full bg-background/95">
            {/* Mobile member selector */}
            <div className="md:hidden border-b border-border bg-card p-3">
              <FamilyMemberList
                selectedMember={selectedMember}
                onSelectMember={setSelectedMember}
              />
            </div>

            {/* Selected member header */}
            {selectedMember && (
              <div className="border-b border-border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {selectedMember.username.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedMember.username}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
              </div>
            )}

            <MessageList selectedMember={selectedMember} />
            <MessageInput selectedMember={selectedMember} />
          </div>
        </div>
      </div>
    </div>
  );
}
