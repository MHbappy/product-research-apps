'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { getRecentTransactionsAdmin } from '@/lib/api/admin-payment.service';
import { PaymentTransaction } from '@/lib/api/subscription.service';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function RecentSales() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentTransactionsAdmin()
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className='flex h-full min-h-[300px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-300' />
      </Card>
    );
  }

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          Latest {transactions.length} successful transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {transactions.map((tx) => (
            <div key={tx.id} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                {/* Use a clear fallback since we might not have avatars */}
                <AvatarFallback>
                  {tx.userEmail?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {tx.userEmail || `User #${tx.userId}`}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {tx.description}
                </p>
              </div>
              <div className='ml-auto font-medium'>
                +${tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className='py-4 text-center text-sm text-gray-500'>
              No recent sales
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
