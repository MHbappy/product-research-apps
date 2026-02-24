'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import PaymentGatewayForm from '@/features/payment/components/PaymentGatewayForm';
import PlanManager from '@/features/payment/components/PlanManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PaymentHistoryTable } from '@/features/payment/components/PaymentHistoryTable';
import { getAllTransactions } from '@/lib/api/admin-payment.service';
import { PaymentTransaction } from '@/lib/api/subscription.service';
import { useState, useEffect } from 'react';

export default function PaymentAdminPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    getAllTransactions().then(setTransactions).catch(console.error);
  }, []);

  return (
    <PageContainer>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between'>
          <Heading
            title='Payment Configuration'
            description='Manage payment gateways and subscription plans.'
          />
        </div>
        <Separator />

        <Tabs defaultValue='gateways' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='gateways'>Gateways</TabsTrigger>
            <TabsTrigger value='plans'>Plans</TabsTrigger>
            <TabsTrigger value='transactions'>Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value='gateways' className='space-y-4'>
            <PaymentGatewayForm />
          </TabsContent>

          <TabsContent value='plans' className='space-y-4'>
            <PlanManager />
          </TabsContent>

          <TabsContent value='transactions' className='space-y-4'>
            <PaymentHistoryTable transactions={transactions} isAdmin={true} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
