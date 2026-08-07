"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DataTable } from "@/components/table/app-table";
import { getColumns, type User } from "./columns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
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
import HeaderComponent from "./header";

const editUserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string()
});

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRoleUser, setSelectedRoleUser] =
    useState<User | null>(null);
  const [newRole, setNewRole] = useState("");

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatusUser, setSelectedStatusUser] =
    useState<User | null>(null);

    //FETCH users
  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    console.log("GET /api/users:", data);

    if (!response.ok) {
      throw new Error(
        data?.error ?? data?.message ?? "Failed to fetch users"
      );
    }

    return data;
  }, []);

  const extractUsers = useCallback(
    (result: unknown): User[] => {
      const data = result as {
        users?: {
          data?: {
            data?: {
              users?: User[];
            };
          };
        };
        data?: {
          users?: User[];
        };
      };

      const fetchedUsers =
        data?.users?.data?.data?.users ??
        data?.data?.users ??
        [];

      return Array.isArray(fetchedUsers)
        ? fetchedUsers
        : [];
    },
    []
  );

  const reloadUsers = useCallback(async () => {
    const result = await fetchUsers();
    const fetchedUsers = extractUsers(result);

    setUsers(fetchedUsers);
  }, [fetchUsers, extractUsers]);


  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const result = await fetchUsers();

        if (!mounted) {
          return;
        }

        setUsers(extractUsers(result));
      } catch (error) {
        console.error("Error fetching users:", error);

        if (mounted) {
          notify.error(
            error instanceof Error
              ? error.message
              : "Failed to load users"
          );
        }
      } finally {
        if (mounted) {
          setLoadingUsers(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [fetchUsers, extractUsers]);

  const editForm = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },

    validators: {
      onSubmit: editUserSchema,
    },

    onSubmit: async ({ value }) => {
      if (!editingUser) {
        notify.error("No user selected");
        return;
      }

      const userId = editingUser.id;

      try {
        setSubmitting(true);

        const body = {
          email: value.email,
          name: value.name,
          ...(value.password?.trim()
            ? {
                password: value.password,
              }
            : {}),
        };

        console.log("Updating user:", userId, body);

        const response = await fetch(
          `/api/users/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        const data = await response
          .json()
          .catch(() => null);

        console.log(
          "PATCH /api/users/:id:",
          response.status,
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.error ??
              data?.message ??
              "Failed to update user"
          );
        }

        await reloadUsers();

        editForm.reset();
        setEditingUser(null);
        setEditDialogOpen(false);

        notify.success("User updated successfully");
      } catch (error) {
        console.error("Error updating user:", error);

        notify.error(
          error instanceof Error
            ? error.message
            : "Failed to update user"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEdit = useCallback(
    (user: User) => {
      setEditingUser(user);

      editForm.setFieldValue(
        "email",
        user.email ?? ""
      );

      editForm.setFieldValue(
        "name",
        user.name ?? ""
      );

      editForm.setFieldValue("password", "");

      setEditDialogOpen(true);
    },
    [editForm]
  );

  const openRoleDialog = useCallback((user: User) => {
    setSelectedRoleUser(user);
    setNewRole(user.role ?? "");
    setRoleDialogOpen(true);
  }, []);

  const submitRoleChange = useCallback(async () => {
    if (!selectedRoleUser) {
      notify.error("No user selected");
      return;
    }

    const role = newRole.trim();

    if (!role) {
      notify.error("Role is required");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `/api/users/${selectedRoleUser.id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
          }),
        }
      );

      const data = await response.json().catch(() => null);
      console.log("PATCH role:", response.status, data);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            data?.message ??
            "Failed to update user role"
        );
      }

      await reloadUsers();

      setRoleDialogOpen(false);
      setSelectedRoleUser(null);
      setNewRole("");

      notify.success(
        `User role changed to ${role}`
      );
    } catch (error) {
      console.error("Error changing role:",error);

      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to update user role"
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedRoleUser,
    newRole,
    reloadUsers,
  ]);

  const openStatusDialog = useCallback(
    (user: User) => {
      setSelectedStatusUser(user);
      setStatusDialogOpen(true);
    },
    []
  );

  const submitStatusChange = useCallback(async () => {
    if (!selectedStatusUser) {
      notify.error("No user selected");
      return;
    }

    const currentStatus = selectedStatusUser.status;

    const newStatus =
      currentStatus === "authorized"
        ? "Active"
        : "Blocked";

    try {
      setSubmitting(true);

      const response = await fetch(
        `/api/users/${selectedStatusUser.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      console.log("PATCH status:", response.status, data);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            data?.message ??
            "Failed to update user status"
        );
      }

      await reloadUsers();

      setStatusDialogOpen(false);
      setSelectedStatusUser(null);

      notify.success(
        `User status changed to ${newStatus}`
      );
    } catch (error) {
      console.error(
        "Error changing status:",
        error
      );

      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to update user status"
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedStatusUser,
    reloadUsers,
  ]);

  const handleDelete = useCallback((user: User) => {
    console.log("Delete user:", user.id);

    notify.error(
      `Delete ${user.email} is not implemented yet`
    );
  }, []);

  const userColumns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onChangeRole: openRoleDialog,
        onChangeStatus: openStatusDialog,
        onDelete: handleDelete,
      }),
    [
      handleEdit,
      openRoleDialog,
      openStatusDialog,
      handleDelete,
    ]
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <HeaderComponent onUserCreated={reloadUsers}/>
      </div>

      {loadingUsers ? (
        <div className="flex min-h-75 items-center justify-center">
          <Loader text="Fetching users..." />
        </div>) 
      : 
      (<DataTable
          columns={userColumns}
          data={users}
        />
      )}

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);

          if (!open) {
            editForm.reset();
            setEditingUser(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>
              Edit User
            </DialogTitle>

            <DialogDescription>
              Update the user&apos;s account information.
            </DialogDescription>
          </DialogHeader>

          <form
            id="edit-user-form"
            onSubmit={async (event) => {
              event.preventDefault();
              event.stopPropagation();

              await editForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <editForm.Field name="email">
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
              </editForm.Field>

              <editForm.Field name="name">
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
              </editForm.Field>

              <editForm.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel>
                      New Password
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
                      placeholder="Leave blank to keep current password"
                    />
                  </Field>
                )}
              </editForm.Field>
            </FieldGroup>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                editForm.reset();
                setEditingUser(null);
                setEditDialogOpen(false);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="edit-user-form"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={roleDialogOpen}
        onOpenChange={(open) => {
          setRoleDialogOpen(open);

          if (!open) {
            setSelectedRoleUser(null);
            setNewRole("");
          }
        }}
      >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              Change User Role
            </DialogTitle>

            <DialogDescription>
              Change the role for{" "}
              {selectedRoleUser?.email}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <FieldLabel>
                Current Role
              </FieldLabel>

              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                {selectedRoleUser?.role ||
                  "No role"}
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="new-role">
                New Role
              </FieldLabel>

              <Input
                id="new-role"
                value={newRole}
                onChange={(event) =>
                  setNewRole(event.target.value)
                }
                placeholder="admin"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRoleDialogOpen(false);
                setSelectedRoleUser(null);
                setNewRole("");
              }}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={submitRoleChange}
              disabled={submitting || !selectedRoleUser || !newRole.trim()}
            >
              {submitting ? (
                <>
                  <Loader />
                  Changing...
                </>
              ) : (
                "Change Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          setStatusDialogOpen(open);

          if (!open) {
            setSelectedStatusUser(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              Change User Status
            </DialogTitle>

            <DialogDescription>
              Change the status for{" "}
              {selectedStatusUser?.email}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Current status
              </p>

              <p className="mt-1 font-medium capitalize">
                {selectedStatusUser?.status ||"blocked"}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              This will change the user to{" "}
              <strong>
                {selectedStatusUser?.status ===
                "authorized"
                  ? "Active"
                  : "Blocked"}
              </strong>
              .
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStatusDialogOpen(false);
                setSelectedStatusUser(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={submitStatusChange}
              disabled={
                submitting ||
                !selectedStatusUser
              }
            >
              {submitting ? (
                <>
                  <Loader />
                  Changing...
                </>
              ) : (
                "Change Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}