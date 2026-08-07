"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/table/app-table";
import { columns } from "./columns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { Loader } from "@/components/ui/loader";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import * as z from "zod";
import { notify } from "@/lib/toast";

const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
  role: z.string().min(1, "Role is required"),
});

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: string;
  lastLogin?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  const { loading, withLoading } = useLoading();

  const fetchUsers = async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  };

  const reloadUsers = async () => {
    const result = await fetchUsers();

    setUsers(result?.users?.data?.data?.users ?? []);
  };

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "",
    },

    validators: {
      onSubmit: userSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await withLoading(async () => {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            throw new Error(
              errorData?.message ?? "Failed to create user"
            );
          }

          await reloadUsers();

          notify.success("User created successfully");

          form.reset();
          setOpen(false);
        });
      } catch (error) {
        console.error("Error creating user:", error);

        notify.error(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      }
    },
  });

  useEffect(() => {
    withLoading(async () => {
      const result = await fetchUsers();

      setUsers(result?.users?.data?.data?.users ?? []);
    }).catch((error) => {
      console.error("Error fetching users:", error);
      notify.error("Failed to load users");
    });
  }, []);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Users
          </h1>

          <p className="text-muted-foreground">
            Manage system administrators and users.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>
              Add User
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>

              <DialogDescription>
                Create a new administrator. The user will be added
                to the system.
              </DialogDescription>
            </DialogHeader>

            <form
              id="create-user-form"
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                await form.handleSubmit();
              }}
            >
              <FieldGroup>
                {/* EMAIL */}
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Email
                        </FieldLabel>

                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Enter your email"
                          autoComplete="email"
                        />

                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* NAME */}
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Name
                        </FieldLabel>

                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Admin Name"
                          autoComplete="name"
                        />

                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* PASSWORD */}
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Password
                        </FieldLabel>

                        <Input
                          id={field.name}
                          type="password"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Enter password"
                          autoComplete="new-password"
                        />

                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* ROLE */}
                <form.Field
                  name="role"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Role
                        </FieldLabel>

                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Enter user role"
                          autoComplete="off"
                        />

                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={loading}
              >
                Reset
              </Button>

              <Button
                type="submit"
                form="create-user-form"
                disabled={loading}
              >
                {loading ? (
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

      {loading ? (
        <div className="flex min-h-75 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
        />
      )}
    </div>
  );
}