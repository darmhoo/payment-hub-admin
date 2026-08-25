/* eslint-disable react/no-children-prop */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useStore } from '@tanstack/react-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

import PageContainer from '@/components/app-page-container';
import AppPageHeader from '@/components/app-page-header';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader } from '@/components/ui/loader';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { notify } from '@/lib/toast';
import { providerConfigs } from '@/lib/provider-configs';

const providerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  driver: z.string().min(1, 'Driver is required'),
  environment: z.string().min(1, 'Environment is required'),
  active: z.boolean(),
  is_default: z.boolean(),
  priority: z.number().min(1, 'Priority must be at least 1'),
  settings: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      encrypted: z.boolean(),
    })
  ),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

interface EditProviderProps {
  providerId: string;
}

const drivers = [
  { label: 'Mpesa', value: 'mpesa' },
  { label: "Africa's Talking", value: 'africastalking' },
  { label: 'Smtp', value: 'smtp' },
  { label: 'Twilio', value: 'twilio' },
];

const categories = [
  { label: 'Sms', value: 'sms' },
  { label: 'Email', value: 'email' },
  { label: 'Payment', value: 'payment' },
];

const environments = [
  { label: 'Sandbox', value: 'sandbox' },
  { label: 'Production', value: 'production' },
];

export default function EditProvider({ providerId }: EditProviderProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProviderFormValues>({
    defaultValues: {
      name: '',
      category: '',
      driver: '',
      environment: 'sandbox',
      active: true,
      is_default: false,
      priority: 1,
      settings: [],
    },

    validators: {
      onSubmit: providerSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        setSaving(true);

        const response = await fetch(`/api/providers/${providerId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error ?? data?.message ?? 'Failed to update provider');
        }

        notify.success('Provider updated successfully');

        router.push('/providers');
        router.refresh();
      } catch (error) {
        console.error('Error updating provider:', error);

        notify.error(error instanceof Error ? error.message : 'Failed to update provider');
      } finally {
        setSaving(false);
      }
    },
  });

  /* ---------------------------------------------------------------------- */
  /* Load provider */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/providers/${providerId}`, {
          method: 'GET',
          cache: 'no-store',
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error ?? data?.message ?? 'Failed to fetch provider');
        }

        const provider = data?.provider ?? data?.data?.provider ?? data?.data;

        if (!provider) {
          throw new Error('Provider not found');
        }

        form.reset({
          name: provider.name ?? '',
          category: provider.category ?? '',
          driver: provider.driver ?? '',
          environment: provider.environment ?? 'sandbox',
          active: Boolean(provider.active),
          is_default: Boolean(provider.is_default),
          priority: Number(provider.priority) || 1,
          settings: Array.isArray(provider.settings)
            ? provider.settings.map(
                (setting: { key: string; value?: string; encrypted?: boolean }) => ({
                  key: setting.key,
                  value: setting.value ?? '',
                  encrypted: setting.encrypted ?? false,
                })
              )
            : [],
        });
      } catch (error) {
        console.error('Error loading provider:', error);

        notify.error(error instanceof Error ? error.message : 'Failed to load provider');

        router.push('/providers');
      } finally {
        setLoading(false);
      }
    };

    loadProvider();
  }, [providerId, form, router]);

  const selectedDriver = useStore(form.store, (state) => state.values.driver);

  const providerConfig = selectedDriver
    ? providerConfigs[selectedDriver as keyof typeof providerConfigs]
    : undefined;

  if (loading) {
    return (
      <PageContainer className="min-h-screen p-4">
        <div className="flex h-64 items-center justify-center">
          <Loader text="Fetching provider..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="min-h-screen space-y-6 p-4">
      <AppPageHeader
        title="Edit Provider"
        description="Update provider configuration."
        action={
          <Button type="button" variant="outline" onClick={() => router.push('/providers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form
          id="edit-provider-form"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* General information */}

            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>

                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                      />

                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="category"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Category</FieldLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value ?? '')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent>
                          {categories.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="driver"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Driver</FieldLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value ?? '')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>

                        <SelectContent>
                          {drivers.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="environment"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Environment</FieldLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value ?? '')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>

                        <SelectContent>
                          {environments.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="priority"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Priority</FieldLabel>

                      <Input
                        id={field.name}
                        type="number"
                        min={1}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.valueAsNumber || 0)}
                      />

                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="active"
                children={(field) => (
                  <Field orientation="horizontal" className="flex items-center justify-between">
                    <FieldLabel>Active</FieldLabel>

                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="is_default"
                children={(field) => (
                  <Field orientation="horizontal" className="flex items-center justify-between">
                    <FieldLabel>Set as default</FieldLabel>

                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Dynamic settings */}

            {providerConfig && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Settings</h2>

                  <p className="text-sm text-muted-foreground">
                    Configure settings for the {providerConfig.driver} driver.
                  </p>
                </div>

                <FieldGroup>
                  {providerConfig.fields.map((fieldConfig, index) => (
                    <form.Field
                      key={fieldConfig.name}
                      name={`settings[${index}].value` as `settings[${number}].value`}
                    >
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>{fieldConfig.label}</FieldLabel>

                          <Input
                            id={field.name}
                            type={fieldConfig.type}
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            placeholder={fieldConfig.placeholder}
                            autoComplete="off"
                          />
                        </Field>
                      )}
                    </form.Field>
                  ))}
                </FieldGroup>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/providers')}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="submit" form="edit-provider-form" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
