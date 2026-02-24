import {
  PaymentTransaction,
  downloadInvoice
} from '@/lib/api/subscription.service';
import { downloadUserInvoice } from '@/lib/api/admin-payment.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentHistoryTableProps {
  transactions: PaymentTransaction[];
  isAdmin?: boolean;
}

export function PaymentHistoryTable({
  transactions,
  isAdmin = false
}: PaymentHistoryTableProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = async (transactionId: number) => {
    try {
      setDownloadingId(transactionId);
      if (isAdmin) {
        await downloadUserInvoice(transactionId);
      } else {
        await downloadInvoice(transactionId);
      }
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className='py-8 text-center text-gray-500'>
        No payment history found.
      </div>
    );
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {isAdmin && <TableHead>User</TableHead>}
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead className='text-right'>Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                {format(new Date(tx.createdAt), 'MMM d, yyyy HH:mm')}
              </TableCell>
              {isAdmin && (
                <TableCell className='font-medium'>
                  {tx.userEmail || `User #${tx.userId}`}
                </TableCell>
              )}
              <TableCell>{tx.description}</TableCell>
              <TableCell>
                {tx.currency} {tx.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={tx.status === 'SUCCESS' ? 'default' : 'destructive'}
                  className={tx.status === 'SUCCESS' ? 'bg-green-500' : ''}
                >
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell>{tx.gateway}</TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleDownload(tx.id)}
                  disabled={downloadingId === tx.id || tx.status !== 'SUCCESS'}
                >
                  {downloadingId === tx.id ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Download className='h-4 w-4' />
                  )}
                  <span className='sr-only'>Download</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
