'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

import { notify } from '@/lib/toast';

import type { User } from '@/app/(app)/users/columns';

const editUserSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string(),
});

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => Promise<void>;
}

export default function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserDialogProps) {
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },

    validators: {
      onSubmit: editUserSchema,
    },

    onSubmit: async ({ value }) => {
      if (!user) {
        notify.error('No user selected');
        return;
      }

      try {
        const body = {
          email: value.email,
          name: value.name,
          ...(value.password.trim()
            ? {
                password: value.password,
              }
            : {}),
        };

        const response = await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => null);

        console.log('Update user:', {
          status: response.status,
          body,
          data,
        });

        if (!response.ok) {
          throw new Error(data?.error ?? data?.message ?? 'Failed to update user');
        }
        await onUserUpdated();
        onOpenChange(false);
        form.reset();

        notify.success('User updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);

        notify.error(error instanceof Error ? error.message : 'Failed to update user');
      }
    },
  });

  useEffect(() => {
    if (!user) {
      form.reset({
        email: '',
        name: '',
        password: '',
      });

      return;
    }

    form.reset({
      email: user.email ?? '',
      name: user.name ?? '',
      password: '',
    });
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>

          <DialogDescription>Update the user&apos;s account information.</DialogDescription>
        </DialogHeader>

        <form
          id="edit-user-form"
          onSubmit={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            await form.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Email</FieldLabel>

                    <Input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Name</FieldLabel>

                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      placeholder={field.form.getFieldValue('name')}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <Field>
                  <FieldLabel>New Password</FieldLabel>

                  <Input
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" form="edit-user-form" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
