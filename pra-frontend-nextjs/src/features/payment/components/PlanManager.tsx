'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  SubscriptionPlan
} from '@/lib/api/admin-payment.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function PlanManager() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<SubscriptionPlan>({
    name: '',
    code: '',
    price: 0,
    currency: 'USD',
    interval: 'MONTHLY',
    description: '',
    features: [],
    active: true
  });
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const data = await getSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      console.error('Failed to load plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      // Edit mode
      setEditingPlanId(plan.id || null);
      setFormData(plan);
      setFeaturesText(plan.features.join('\n'));
    } else {
      // Create mode
      setEditingPlanId(null);
      setFormData({
        name: '',
        code: '',
        price: 0,
        currency: 'USD',
        interval: 'MONTHLY',
        description: '',
        features: [],
        active: true
      });
      setFeaturesText('');
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.code || formData.price < 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const planPayload = {
        ...formData,
        features: featuresText.split('\n').filter((f) => f.trim() !== '')
      };

      if (editingPlanId) {
        await updateSubscriptionPlan(editingPlanId, planPayload);
        toast.success('Plan updated successfully');
      } else {
        await createSubscriptionPlan(planPayload);
        toast.success('Plan created successfully');
      }

      setIsDialogOpen(false);
      loadPlans();
    } catch (error) {
      console.error('Failed to save plan:', error);
      toast.error(
        editingPlanId ? 'Failed to update plan' : 'Failed to create plan'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>
            Manage available subscription tiers.
          </CardDescription>
        </div>

        <Button size='sm' onClick={() => handleOpenDialog()}>
          <Plus className='mr-2 h-4 w-4' /> Add Plan
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  <Loader2 className='mr-2 inline-block h-4 w-4 animate-spin' />
                  Loading plans...
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  No plans found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className='font-medium'>
                    <div>{plan.name}</div>
                    <div className='text-muted-foreground text-xs'>
                      {plan.code}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.price === 0
                      ? 'Free'
                      : `${plan.price} ${plan.currency}`}
                  </TableCell>
                  <TableCell>{plan.interval}</TableCell>
                  <TableCell>
                    <Badge variant={plan.active ? 'default' : 'secondary'}>
                      {plan.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleOpenDialog(plan)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>
                {editingPlanId
                  ? 'Edit Subscription Plan'
                  : 'Create Subscription Plan'}
              </DialogTitle>
              <DialogDescription>
                {editingPlanId
                  ? 'Update existing plan details.'
                  : 'Add a new plan for users to subscribe to.'}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    placeholder='e.g. Pro Plan'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='code'>Code</Label>
                  <Input
                    id='code'
                    placeholder='e.g. PRO_MONTHLY'
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase()
                      })
                    }
                    disabled={!!editingPlanId} // Code should be immutable
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='price'>Price</Label>
                  <Input
                    id='price'
                    type='number'
                    min='0'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value)
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='currency'>Currency</Label>
                  <Input
                    id='currency'
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currency: e.target.value.toUpperCase()
                      })
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='interval'>Billing Interval</Label>
                <Select
                  value={formData.interval}
                  onValueChange={(val: 'MONTHLY' | 'YEARLY') =>
                    setFormData({ ...formData, interval: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select interval' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MONTHLY'>Monthly</SelectItem>
                    <SelectItem value='YEARLY'>Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center space-x-2'>
                <Switch
                  id='active'
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
                <Label htmlFor='active'>Active Plan</Label>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Input
                  id='description'
                  placeholder='Brief description of the plan'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='features'>Features (one per line)</Label>
                <Textarea
                  id='features'
                  placeholder='Feature 1&#10;Feature 2&#10;Feature 3'
                  className='h-24'
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {editingPlanId ? 'Update Plan' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
