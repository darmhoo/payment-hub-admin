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

import { notify } from "@/lib/toast";

const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

interface HeaderComponentProps {
  onUserCreated?: () => Promise<void> | void;
}

export default function HeaderComponent({
  onUserCreated,
}: HeaderComponentProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createForm = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },

    validators: {
      onSubmit: createUserSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        setSubmitting(true);

        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        const data = await response.json().catch(() => null);

        console.log(
          "POST /api/users:",
          response.status,
          data
        );

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
        console.error(
          "Error creating user:",
          error
        );

        notify.error(
          error instanceof Error
            ? error.message
            : "Failed to create user"
        );
      } finally {
        setSubmitting(false);
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
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Users
        </h1>

        <p className="text-muted-foreground">
          Manage system administrators and users.
        </p>
      </div>

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <DialogTrigger>
          <Button>
            Add User
          </Button>
        </DialogTrigger>

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
          >
            <FieldGroup>
              {/* Email */}
              <createForm.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
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

              {/* Name */}
              <createForm.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
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

              {/* Password */}
              <createForm.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                    >
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
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="create-user-form"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}