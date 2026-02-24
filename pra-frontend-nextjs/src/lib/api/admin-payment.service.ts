import { apiClient } from './client';
import { PaymentTransaction } from './subscription.service';

export interface GatewayConfigDto {
  gatewayName: 'STRIPE' | 'PAYPAL';
  apiKey: string;
  secretKey?: string;
  isEnabled: boolean;
  isTestMode: boolean;
  webhookSecret?: string;
}

export interface GatewayConfig {
  id: number;
  gatewayName: 'STRIPE' | 'PAYPAL';
  apiKey: string;
  isEnabled: boolean;
  isTestMode: boolean;
  webhookSecret?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionPlan {
  id?: number;
  name: string;
  code: string;
  price: number;
  currency: string;

  interval: 'MONTHLY' | 'YEARLY';
  description: string;
  features: string[];
  active: boolean;
}

export async function getGatewayConfigs(): Promise<GatewayConfig[]> {
  const response = await apiClient.get<GatewayConfig[]>(
    '/admin/payment/gateways'
  );
  return response.data;
}

export async function updateGatewayConfig(
  config: GatewayConfigDto
): Promise<GatewayConfig> {
  const response = await apiClient.post<GatewayConfig>(
    '/admin/payment/gateways',
    config
  );
  return response.data;
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await apiClient.get<SubscriptionPlan[]>(
    '/admin/payment/plans'
  );
  return response.data;
}

export async function createSubscriptionPlan(
  plan: SubscriptionPlan
): Promise<SubscriptionPlan> {
  const response = await apiClient.post<SubscriptionPlan>(
    '/admin/payment/plans',
    plan
  );
  return response.data;
}

export async function updateSubscriptionPlan(
  id: number,
  plan: Partial<SubscriptionPlan>
): Promise<SubscriptionPlan> {
  const response = await apiClient.put<SubscriptionPlan>(
    `/admin/payment/plans/${id}`,
    plan
  );
  return response.data;
}

export async function getAllTransactions(): Promise<PaymentTransaction[]> {
  const response = await apiClient.get<PaymentTransaction[]>(
    '/admin/payment/transactions'
  );
  return response.data;
}

export async function getUserTransactionsAdmin(
  userId: number
): Promise<PaymentTransaction[]> {
  const response = await apiClient.get<PaymentTransaction[]>(
    `/admin/payment/transactions/user/${userId}`
  );
  return response.data;
}

export interface DashboardStats {
  totalRevenue: number;
  todaysRevenue: number;
  activeSubscriptions: number;
  totalUsers: number;
  monthlyRecurringRevenue?: number;
  failedPayments?: number;
  churnedSubscriptions?: number;
  activeTrials?: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>(
    '/admin/payment/dashboard/stats'
  );
  return response.data;
}

export interface ChartData {
  label: string;
  value: number;
}

export async function getDailyRevenue(): Promise<ChartData[]> {
  const response = await apiClient.get<ChartData[]>(
    '/admin/payment/dashboard/chart/revenue/daily'
  );
  return response.data;
}

export async function getMonthlyRevenue(): Promise<ChartData[]> {
  const response = await apiClient.get<ChartData[]>(
    '/admin/payment/dashboard/chart/revenue/monthly'
  );
  return response.data;
}

export async function getRecentTransactionsAdmin(): Promise<
  PaymentTransaction[]
> {
  const response = await apiClient.get<PaymentTransaction[]>(
    '/admin/payment/dashboard/transactions/recent'
  );
  return response.data;
}

export interface ActiveSubscriber {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  planName: string;
  status: string;
  currentPeriodEnd: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export async function getActiveSubscribers(
  page: number = 0,
  size: number = 10
): Promise<PageResponse<ActiveSubscriber>> {
  const response = await apiClient.get<PageResponse<ActiveSubscriber>>(
    '/admin/payment/dashboard/subscribers/active',
    {
      params: { page, size }
    }
  );
  return response.data;
}

export async function cancelUserSubscription(userId: number): Promise<void> {
  await apiClient.post(`/admin/payment/subscription/cancel/${userId}`);
}

export async function downloadUserInvoice(
  transactionId: number
): Promise<void> {
  const response = await apiClient.get<Blob>(
    `/admin/payment/invoices/${transactionId}`,
    {
      responseType: 'blob'
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice_${transactionId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
