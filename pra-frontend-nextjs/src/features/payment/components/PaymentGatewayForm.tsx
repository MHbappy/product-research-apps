'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  getGatewayConfigs,
  updateGatewayConfig
} from '@/lib/api/admin-payment.service';
import { toast } from 'sonner';

export default function PaymentGatewayForm() {
  const [loading, setLoading] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({
    apiKey: '',
    secretKey: '',
    isEnabled: false,
    isTestMode: true
  });

  const [paypalConfig, setPaypalConfig] = useState({
    clientId: '',
    clientSecret: '',
    isEnabled: false,
    isTestMode: true
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const configs = await getGatewayConfigs();
      const stripe = configs.find((c) => c.gatewayName === 'STRIPE');
      const paypal = configs.find((c) => c.gatewayName === 'PAYPAL');

      if (stripe) {
        setStripeConfig({
          apiKey: stripe.apiKey || '',
          secretKey: '', // Don't show secret key
          isEnabled: stripe.isEnabled,
          isTestMode: stripe.isTestMode
        });
      }

      if (paypal) {
        setPaypalConfig({
          clientId: paypal.apiKey || '',
          clientSecret: '',
          isEnabled: paypal.isEnabled,
          isTestMode: paypal.isTestMode
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load gateway configurations.');
    }
  };

  const handleSave = async (gateway: 'STRIPE' | 'PAYPAL') => {
    setLoading(true);
    try {
      if (gateway === 'STRIPE') {
        await updateGatewayConfig({
          gatewayName: 'STRIPE',
          apiKey: stripeConfig.apiKey,
          secretKey: stripeConfig.secretKey, // Only sent if changed/provided
          isEnabled: stripeConfig.isEnabled,
          isTestMode: stripeConfig.isTestMode
        });
      } else {
        await updateGatewayConfig({
          gatewayName: 'PAYPAL',
          apiKey: paypalConfig.clientId,
          secretKey: paypalConfig.clientSecret,
          isEnabled: paypalConfig.isEnabled,
          isTestMode: paypalConfig.isTestMode
        });
      }
      toast.success(`${gateway} configuration saved successfully.`);
      // Reload to ensure state sync, though optional if we want to keep secrets cleared
      loadConfigs();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to save ${gateway} configuration.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Payment Gateways</CardTitle>
        <CardDescription>
          Configure Stripe and PayPal integrations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='stripe' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='stripe'>Stripe</TabsTrigger>
            <TabsTrigger value='paypal'>PayPal</TabsTrigger>
          </TabsList>

          <TabsContent value='stripe' className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='stripe-enabled'
                checked={stripeConfig.isEnabled}
                onCheckedChange={(c) =>
                  setStripeConfig({ ...stripeConfig, isEnabled: c })
                }
              />
              <Label htmlFor='stripe-enabled'>Enable Stripe Payments</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='stripe-test'
                checked={stripeConfig.isTestMode}
                onCheckedChange={(c) =>
                  setStripeConfig({ ...stripeConfig, isTestMode: c })
                }
              />
              <Label htmlFor='stripe-test'>Test Mode</Label>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='stripe-key'>Publishable Key</Label>
              <Input
                id='stripe-key'
                type='text'
                value={stripeConfig.apiKey}
                onChange={(e) =>
                  setStripeConfig({ ...stripeConfig, apiKey: e.target.value })
                }
                placeholder='pk_test_...'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='stripe-secret'>Secret Key</Label>
              <Input
                id='stripe-secret'
                type='password'
                value={stripeConfig.secretKey}
                onChange={(e) =>
                  setStripeConfig({
                    ...stripeConfig,
                    secretKey: e.target.value
                  })
                }
                placeholder='sk_test_...'
              />
            </div>
            <Button onClick={() => handleSave('STRIPE')} disabled={loading}>
              {loading ? 'Saving...' : 'Save Stripe Configuration'}
            </Button>
          </TabsContent>

          <TabsContent value='paypal' className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='paypal-enabled'
                checked={paypalConfig.isEnabled}
                onCheckedChange={(c) =>
                  setPaypalConfig({ ...paypalConfig, isEnabled: c })
                }
              />
              <Label htmlFor='paypal-enabled'>Enable PayPal Payments</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='paypal-test'
                checked={paypalConfig.isTestMode}
                onCheckedChange={(c) =>
                  setPaypalConfig({ ...paypalConfig, isTestMode: c })
                }
              />
              <Label htmlFor='paypal-test'>Test Mode</Label>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='paypal-client'>Client ID</Label>
              <Input
                id='paypal-client'
                type='text'
                value={paypalConfig.clientId}
                onChange={(e) =>
                  setPaypalConfig({ ...paypalConfig, clientId: e.target.value })
                }
                placeholder='Details > Client ID'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='paypal-secret'>Client Secret</Label>
              <Input
                id='paypal-secret'
                type='password'
                value={paypalConfig.clientSecret}
                onChange={(e) =>
                  setPaypalConfig({
                    ...paypalConfig,
                    clientSecret: e.target.value
                  })
                }
                placeholder='Details > Secret'
              />
            </div>
            <Button onClick={() => handleSave('PAYPAL')} disabled={loading}>
              {loading ? 'Saving...' : 'Save PayPal Configuration'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
