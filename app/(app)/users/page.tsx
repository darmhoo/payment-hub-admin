"use client";

import { DataTable } from "@/components/table/app-table";
import React, { useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { notify } from "@/lib/toast";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(6).max(100),
});

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const { loading, withLoading } = useLoading();
  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    validators: {
      onSubmit: userSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log(value);
        await withLoading(async () => {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
          });

          if (!response.ok) {
            throw new Error("Failed to create user");
          }

          const data = await response.json();
          await reloadUsers();
          notify.success("User created Successfully");
        });
      } catch (error) {
        console.error("Error creating user:", error);
        notify.error("Something occured");
      }
    },
  });

  const reloadUsers = async () => {
    const result = await fetchUsers();
    setUsers(result.users.data.data.users);
  };
  async function fetchUsers() {
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
  }

  useEffect(() => {
    withLoading(fetchUsers)
      .then((data) => {
        setUsers(data.users.data.data.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  return (
    <div className="min-h-screen bg-slate-100 px-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Users</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader text="Fetching users..." />
        </div>
      ) : (
        <div className="min-h-screen bg-slate-100">
          <div className="align-right mb-4 flex justify-end">
            <Dialog>
              <form
                id="create-user-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(form.state);
                  form.handleSubmit();
                }}
              >
                <DialogTrigger
                  render={<Button variant="outline">Add User</Button>}
                />
                <DialogContent className="sm:max-w-106.25">
                  <DialogHeader className="text-lg font-semibold">
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                      Create new admins, they will be added to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <form.Field
                      name="email"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="Admin Email"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                    <form.Field
                      name="name"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
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
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

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
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </FieldGroup>

                  <DialogFooter>
                    <Field orientation="horizontal">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Reset
                      </Button>
                      <Button type="submit" form="create-user-form">
                        Submit
                      </Button>
                    </Field>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
          <DataTable columns={columns} data={users} />
        </div>
      )}
    </div>
  );
}
