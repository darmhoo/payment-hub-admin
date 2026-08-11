"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DataTable } from "@/components/table/app-table";

import { getColumns, type User } from "./columns";
import { Loader } from "@/components/ui/loader";
import { notify } from "@/lib/toast";

import AppPageHeader from "@/components/app-page-header";
import PageContainer from "@/components/app-page-container";

import NewUserDialog from "@/components/create-user-dialog";
import EditUserDialog from "@/components/edit-user-dialog";
import EditStatusDialog from "@/components/edit-status-dialog";
import EditRoleDialog from "@/components/edit-role-dialog";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRoleUser, setSelectedRoleUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatusUser, setSelectedStatusUser] = useState<User | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.error ??
          data?.message ??
          "Failed to fetch users"
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
    setUsers(extractUsers(result));
  }, [fetchUsers, extractUsers]);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const result = await fetchUsers();

        if (!mounted) return;

        setUsers(extractUsers(result));
      } catch (error) {
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

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  }, []);

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
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json().catch(() => null);

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

      notify.success(`User role changed to ${role}`);
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to update user role"
      );
    } finally {
      setSubmitting(false);
    }
  }, [selectedRoleUser, newRole, reloadUsers]);

  const openStatusDialog = useCallback((user: User) => {
    setSelectedStatusUser(user);
    setStatusDialogOpen(true);
  }, []);

  const submitStatusChange = useCallback(async () => {
    if (!selectedStatusUser) {
      notify.error("No user selected");
      return;
    }

    const currentStatus = selectedStatusUser.status;

    const newStatus =
      currentStatus === "active"
        ? "blocked"
        : "active";

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
      notify.error(
        error instanceof Error
          ? error.message
          : "Failed to update user status"
      );
    } finally {
      setSubmitting(false);
    }
  }, [selectedStatusUser, reloadUsers]);

  const handleDelete = useCallback((user: User) => {
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
    <PageContainer className="min-h-screen bg-slate-100 space-y-2 p-2">
      <AppPageHeader
        title="Users"
        description="Manage system administrators and users."
        action={
          <NewUserDialog onUserCreated={reloadUsers} />
        }
      />

      {loadingUsers ? (
        <div className="flex min-h-75 items-center justify-center">
          <Loader text="Fetching users..." />
        </div>
      ) : (
        <DataTable
          columns={userColumns}
          data={users}
        />
      )}

      <EditUserDialog
        user={editingUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserUpdated={reloadUsers}
      />

      <EditRoleDialog
        user={selectedRoleUser}
        open={roleDialogOpen}
        role={newRole}
        submitting={submitting}
        onRoleChange={setNewRole}
        onSubmit={submitRoleChange}
        onOpenChange={setRoleDialogOpen}
      />

      <EditStatusDialog
        user={selectedStatusUser}
        open={statusDialogOpen}
        submitting={submitting}
        onSubmit={submitStatusChange}
        onOpenChange={setStatusDialogOpen}
      />
    </PageContainer>
  );
}