"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { notify } from "@/lib/toast";

const createUserSchema = z.object({
  email: z.email("Invalid email address"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  role: z.enum(["admin", "super_admin"], {
    message: "Please select a role",
  }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

interface NewUserDialogProps {
  onUserCreated?: () => Promise<void> | void;
}

export default function NewUserDialog({
  onUserCreated,
}: NewUserDialogProps) {
  const [open, setOpen] = useState(false);

  const createForm = useForm({
    defaultValues: {
      email: "",
      name: "",
      role: undefined as
        | "admin"
        | "super_admin"
        | undefined,
      password: "",
    },

    validators: {
      onSubmit: createUserSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ??
              data?.message ??
              "Failed to create user"
          );
        }

        await onUserCreated?.();

        createForm.reset();
        setOpen(false);

        notify.success("User created successfully");
      } catch (error) {
        console.error("Error creating user:", error);

        notify.error(
          error instanceof Error
            ? error.message
            : "Failed to create user"
        );
      }
    },
  });

  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (!value) {
      createForm.reset();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger
        render={
          <Button>
            Add User
          </Button>
        }
      />

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            Create User
          </DialogTitle>

          <DialogDescription>
            Create a new administrator.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-user-form"
          onSubmit={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            await createForm.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup>
            <createForm.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Email
                    </FieldLabel>

                    <Input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(
                          event.target.value
                        )
                      }
                      placeholder="admin@example.com"
                    />

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </createForm.Field>

            <createForm.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Name
                    </FieldLabel>

                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(
                          event.target.value
                        )
                      }
                      placeholder="John Doe"
                    />

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </createForm.Field>

            {/* Role
            <createForm.Field name="role">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Role
                    </FieldLabel>

                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(
                          value as
                            | "admin"
                            | "super_admin"
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="admin">
                          Administrator
                        </SelectItem>

                        <SelectItem value="super_admin">
                          Super Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </createForm.Field> */}

            <createForm.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Password
                    </FieldLabel>

                    <Input
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(
                          event.target.value
                        )
                      }
                      placeholder="••••••••"
                    />

                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </createForm.Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              createForm.reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>

          <createForm.Subscribe
            selector={(state) => state.isSubmitting}
          >
            {(isSubmitting) => (
              <Button
                type="submit"
                form="create-user-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            )}
          </createForm.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}