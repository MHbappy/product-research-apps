import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    avatarUrl?: string;
    fullName?: string | null;
    email?: string;
    firstName?: string;
    lastName?: string;
    emailAddresses?: Array<{ emailAddress: string }>;
  } | null;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps) {
  const displayName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : null);
  const displayEmail =
    user?.email || user?.emailAddresses?.[0]?.emailAddress || '';

  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={user?.avatarUrl || ''} alt={displayName || ''} />
        <AvatarFallback className='rounded-lg'>
          {displayName?.slice(0, 2)?.toUpperCase() || 'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{displayName || ''}</span>
          <span className='truncate text-xs'>{displayEmail}</span>
        </div>
      )}
    </div>
  );
}
