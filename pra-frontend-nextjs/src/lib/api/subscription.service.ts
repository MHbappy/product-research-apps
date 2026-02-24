import { apiClient } from './client';

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  active: boolean;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  userEmail?: string;
  amount: number;
  currency: string;
  gateway: string;
  transactionId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  type: string;
  description: string;
  failureReason?: string;
  createdAt: string;
}

export async function getActivePlans(): Promise<SubscriptionPlan[]> {
  const response = await apiClient.get<SubscriptionPlan[]>('/payment/plans');
  return response.data;
}

export async function initiateCheckout(
  planId: number,
  gateway?: string
): Promise<CheckoutResponse> {
  const response = await apiClient.post<CheckoutResponse>('/payment/checkout', {
    planId,
    gateway,
    successUrl: window.location.origin + '/dashboard/billing?success=true',
    cancelUrl: window.location.origin + '/dashboard/billing?canceled=true'
  });
  return response.data;
}

export async function getMySubscription(): Promise<any> {
  try {
    const response = await apiClient.get('/payment/subscription');
    if (response.status === 204) return null;
    return response.data;
  } catch (error: any) {
    // If 404/204, return null (no subscription)
    if (
      error.response &&
      (error.response.status === 404 || error.response.status === 204)
    ) {
      return null;
    }
    throw error;
  }
}

export async function getMyTransactions(): Promise<PaymentTransaction[]> {
  const response = await apiClient.get<PaymentTransaction[]>(
    '/payment/transactions'
  );
  return response.data;
}

export async function getEnabledGateways(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/payment/config');
  return response.data;
}

export async function cancelMySubscription(): Promise<void> {
  await apiClient.post('/payment/subscription/cancel');
}

export async function downloadInvoice(transactionId: number): Promise<void> {
  const response = await apiClient.get<Blob>(
    `/payment/invoices/${transactionId}`,
    {
      responseType: 'blob'
    }
  );

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice_${transactionId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
