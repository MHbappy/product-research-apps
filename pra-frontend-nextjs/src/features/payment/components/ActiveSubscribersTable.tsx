'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ActiveSubscriber,
  cancelUserSubscription
} from '@/lib/api/admin-payment.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface ActiveSubscribersTableProps {
  subscribers: ActiveSubscriber[];
  onRefresh?: () => void;
}

export function ActiveSubscribersTable({
  subscribers,
  onRefresh
}: ActiveSubscribersTableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleCancel = async (userId: number) => {
    setLoadingId(userId);
    try {
      await cancelUserSubscription(userId);
      toast.success('Subscription canceled successfully.');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Failed to cancel subscription.');
    } finally {
      setLoadingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Period End</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((sub) => (
            <TableRow key={sub.userId}>
              <TableCell>
                <div className='flex flex-col'>
                  <span className='font-medium'>
                    {sub.firstName} {sub.lastName}
                  </span>
                  <span className='text-muted-foreground text-xs'>
                    {sub.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>{sub.planName}</TableCell>
              <TableCell>
                <Badge
                  variant={sub.status === 'ACTIVE' ? 'default' : 'secondary'}
                >
                  {sub.status}
                </Badge>
              </TableCell>
              <TableCell>
                {sub.currentPeriodEnd
                  ? format(new Date(sub.currentPeriodEnd), 'MMM dd, yyyy')
                  : 'N/A'}
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => setConfirmId(sub.userId)}
                  disabled={loadingId === sub.userId}
                >
                  {loadingId === sub.userId ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    'Cancel'
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {subscribers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='h-24 text-center'>
                No active subscribers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!confirmId}
        onOpenChange={(open) => !open && setConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately cancel the user's subscription. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() => confirmId && handleCancel(confirmId)}
            >
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
