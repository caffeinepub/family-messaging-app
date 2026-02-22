import { useFamilyMembers, useUserProfile } from '../hooks/useQueries';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Users, Loader2 } from 'lucide-react';
import type { UserProfile } from '../backend';

interface FamilyMemberListProps {
  selectedMember: UserProfile | null;
  onSelectMember: (member: UserProfile) => void;
}

export function FamilyMemberList({ selectedMember, onSelectMember }: FamilyMemberListProps) {
  const { data: familyMembers, isLoading } = useFamilyMembers();
  const { data: currentUser } = useUserProfile();

  const otherMembers = familyMembers?.filter(
    (member) => member.userID.toString() !== currentUser?.userID.toString()
  ) || [];

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Family Members</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {otherMembers.length} {otherMembers.length === 1 ? 'member' : 'members'}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {otherMembers.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No other family members yet. Share the app with your family!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {otherMembers.map((member) => {
                const isSelected = selectedMember?.userID.toString() === member.userID.toString();
                const initials = member.username
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <button
                    key={member.userID.toString()}
                    onClick={() => onSelectMember(member)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 touch-manipulation min-h-[60px] ${
                      isSelected
                        ? 'bg-primary/10 border border-primary/20 shadow-sm'
                        : 'hover:bg-accent active:scale-[0.98]'
                    }`}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm">{member.username}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.userID.toString().slice(0, 12)}...
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
