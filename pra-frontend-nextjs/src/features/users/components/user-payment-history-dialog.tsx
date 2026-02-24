import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { User } from '@/types/user.types';
import { PaymentHistoryTable } from '@/features/payment/components/PaymentHistoryTable';
import { getUserTransactionsAdmin } from '@/lib/api/admin-payment.service';
import { PaymentTransaction } from '@/lib/api/subscription.service';
import { Loader2 } from 'lucide-react';

interface UserPaymentHistoryDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserPaymentHistoryDialog({
  user,
  open,
  onOpenChange
}: UserPaymentHistoryDialogProps) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      getUserTransactionsAdmin(user.id)
        .then(setTransactions)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl sm:max-w-6xl'>
        <DialogHeader>
          <DialogTitle>
            Payment History for {user?.fullName || user?.email}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className='flex h-40 items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
          </div>
        ) : (
          <PaymentHistoryTable transactions={transactions} isAdmin={true} />
        )}
      </DialogContent>
    </Dialog>
  );
}
