/* eslint-disable react/no-children-prop */
'use client';

import { useEffect, useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { providerConfigs } from '@/lib/provider-configs';
import { notify } from '@/lib/toast';

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
      key: z.string().min(1, 'Key is required'),
      value: z.string().min(1, 'Value is required'),
      encrypted: z.boolean(),
    })
  ),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

const drivers = [
  {
    label: 'Mpesa',
    value: 'mpesa',
  },
  {
    label: "Africa's Talking",
    value: 'africastalking',
  },
  {
    label: 'Smtp',
    value: 'smtp',
  },
  {
    label: 'Twilio',
    value: 'twilio',
  },
];

const categories = [
  {
    label: 'Sms',
    value: 'sms',
  },
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Payment',
    value: 'payment',
  },
];

const environments = [
  {
    label: 'Sandbox',
    value: 'sandbox',
  },
  {
    label: 'Production',
    value: 'production',
  },
];

/* -------------------------------------------------------------------------- */
/* Props */
/* -------------------------------------------------------------------------- */

interface CreateProviderDialogProps {
  onProviderCreated?: () => Promise<void> | void;
}

/* -------------------------------------------------------------------------- */
/* Component */
/* -------------------------------------------------------------------------- */

export default function CreateProviderDialog({ onProviderCreated }: CreateProviderDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: ProviderFormValues = {
    name: '',
    category: '',
    driver: '',
    environment: 'sandbox',
    active: true,
    is_default: false,
    priority: 1,
    settings: [],
  };

  const form = useForm<ProviderFormValues>({
    defaultValues,

    validators: {
      onSubmit: providerSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        setSubmitting(true);

        const response = await fetch('/api/providers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error ?? data?.message ?? 'Failed to create provider');
        }

        await onProviderCreated?.();

        notify.success('Provider created successfully');

        form.reset();

        setOpen(false);
      } catch (error) {
        console.error('Error creating provider:', error);

        notify.error(error instanceof Error ? error.message : 'Failed to create provider');
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Selected driver */
  /* ------------------------------------------------------------------------ */

  const selectedDriver = useStore(form.store, (state) => state.values.driver);

  const provider = selectedDriver
    ? providerConfigs[selectedDriver as keyof typeof providerConfigs]
    : undefined;

  /* ------------------------------------------------------------------------ */
  /* Dynamic settings */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!provider) {
      form.setFieldValue('settings', []);
      return;
    }

    const settings: ProviderFormValues['settings'] = provider.fields.map((fieldConfig) => ({
      key: fieldConfig.name,
      value: '',
      encrypted: fieldConfig.encrypted ?? false,
    }));

    form.setFieldValue('settings', settings);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDriver]);

  /* ------------------------------------------------------------------------ */
  /* Dialog state */
  /* ------------------------------------------------------------------------ */

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------------ */

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button>Add Provider</Button>} />

      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <form
          id="create-provider-form"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* ---------------------------------------------------------------- */}
          {/* Header */}
          {/* ---------------------------------------------------------------- */}

          <DialogHeader>
            <DialogTitle>Add Provider</DialogTitle>

            <DialogDescription>
              Create a new provider and configure its connection settings.
            </DialogDescription>
          </DialogHeader>

          {/* ---------------------------------------------------------------- */}
          {/* Form body */}
          {/* ---------------------------------------------------------------- */}

          <div className="mb-4 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1 sm:flex-row">
            {/* ============================================================ */}
            {/* General information */}
            {/* ============================================================ */}

            <FieldGroup className="sm:w-1/2 sm:shrink-0">
              {/* ---------------------------------------------------------- */}
              {/* Name */}
              {/* ---------------------------------------------------------- */}

              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Provider name"
                        aria-invalid={isInvalid}
                      />

                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              {/* ---------------------------------------------------------- */}
              {/* Category */}
              {/* ---------------------------------------------------------- */}

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

              {/* ---------------------------------------------------------- */}
              {/* Driver */}
              {/* ---------------------------------------------------------- */}

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

              {/* ---------------------------------------------------------- */}
              {/* Environment */}
              {/* ---------------------------------------------------------- */}

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

              {/* ---------------------------------------------------------- */}
              {/* Priority */}
              {/* ---------------------------------------------------------- */}

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

              {/* ---------------------------------------------------------- */}
              {/* Active */}
              {/* ---------------------------------------------------------- */}

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

              {/* ---------------------------------------------------------- */}
              {/* Default */}
              {/* ---------------------------------------------------------- */}

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

            {/* ============================================================ */}
            {/* Dynamic settings */}
            {/* ============================================================ */}

            {provider && (
              <div className="flex w-full min-w-0 flex-col gap-4 sm:w-1/2">
                <div>
                  <h2 className="text-lg font-semibold">Settings</h2>

                  <p className="text-sm text-muted-foreground">
                    Configure settings for the {provider.driver} driver.
                  </p>
                </div>

                <FieldGroup>
                  {provider.fields.map((fieldConfig, index) => (
                    <form.Field
                      key={fieldConfig.name}
                      name={`settings[${index}].value` as `settings[${number}].value`}
                    >
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
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

                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          </Field>
                        );
                      }}
                    </form.Field>
                  ))}
                </FieldGroup>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button type="submit" form="create-provider-form" disabled={submitting}>
              {submitting ? 'Saving...' : 'Create Provider'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
