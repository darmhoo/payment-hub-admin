'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DataTable } from '@/components/table/app-table';
import { Loader } from '@/components/ui/loader';
import { notify } from '@/lib/toast';

import AppPageHeader from '@/components/app-page-header';
import PageContainer from '@/components/app-page-container';

import NewUserDialog from '@/components/create-user-dialog';
import EditUserDialog from '@/components/edit-user-dialog';
import EditStatusDialog from '@/components/edit-status-dialog';
import EditRoleDialog from '@/components/edit-role-dialog';

import { useUsers } from '@/components/providers/users-provider';

import { getColumns, type User } from './columns';

export default function Users() {
  const { users, loading: loadingUsers, error, fetchUsers, refreshUsers } = useUsers();

  const [submitting, setSubmitting] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const [selectedRoleUser, setSelectedRoleUser] = useState<User | null>(null);

  const [newRole, setNewRole] = useState('');

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [selectedStatusUser, setSelectedStatusUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /*
   * Edit user
   */
  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  }, []);

  /*
   * Change role
   */
  const openRoleDialog = useCallback((user: User) => {
    setSelectedRoleUser(user);
    setNewRole(user.role ?? '');
    setRoleDialogOpen(true);
  }, []);

  const submitRoleChange = useCallback(async () => {
    if (!selectedRoleUser) {
      notify.error('No user selected');
      return;
    }

    const role = newRole.trim();

    if (!role) {
      notify.error('Role is required');
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`/api/users/${selectedRoleUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? data?.message ?? 'Failed to update user role');
      }

      await refreshUsers();

      setRoleDialogOpen(false);
      setSelectedRoleUser(null);
      setNewRole('');

      notify.success(`User role changed to ${role}`);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to update user role');
    } finally {
      setSubmitting(false);
    }
  }, [selectedRoleUser, newRole, refreshUsers]);

  /*
   * Change status
   */
  const openStatusDialog = useCallback((user: User) => {
    setSelectedStatusUser(user);
    setStatusDialogOpen(true);
  }, []);

  const submitStatusChange = useCallback(async () => {
    if (!selectedStatusUser) {
      notify.error('No user selected');
      return;
    }

    const currentStatus = selectedStatusUser.status;

    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';

    try {
      setSubmitting(true);

      const response = await fetch(`/api/users/${selectedStatusUser.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? data?.message ?? 'Failed to update user status');
      }

      await refreshUsers();

      setStatusDialogOpen(false);
      setSelectedStatusUser(null);

      notify.success(`User status changed to ${newStatus}`);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to update user status');
    } finally {
      setSubmitting(false);
    }
  }, [selectedStatusUser, refreshUsers]);

  /*
   * Delete user
   */
  const handleDelete = useCallback((user: User) => {
    notify.error(`Delete ${user.email} is not implemented yet`);
  }, []);

  /*
   * Table columns
   */
  const userColumns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onChangeRole: openRoleDialog,
        onChangeStatus: openStatusDialog,
        onDelete: handleDelete,
      }),
    [handleEdit, openRoleDialog, openStatusDialog, handleDelete]
  );

  return (
    <PageContainer className="min-h-screen space-y-2 p-4">
      <AppPageHeader
        title="Internal Users"
        description="Manage system administrators and users."
        action={<NewUserDialog onUserCreated={refreshUsers} />}
      />

      {loadingUsers ? (
        <div className="flex min-h-75 items-center justify-center">
          <Loader text="Fetching users..." />
        </div>
      ) : error ? (
        <div className="flex min-h-75 items-center justify-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <DataTable columns={userColumns} data={users} emptyMessage="No users found." />
      )}

      <EditUserDialog
        user={editingUser}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);

          if (!open) {
            setEditingUser(null);
          }
        }}
        onUserUpdated={refreshUsers}
      />

      <EditRoleDialog
        user={selectedRoleUser}
        open={roleDialogOpen}
        role={newRole}
        submitting={submitting}
        onRoleChange={setNewRole}
        onSubmit={submitRoleChange}
        onOpenChange={(open) => {
          setRoleDialogOpen(open);

          if (!open) {
            setSelectedRoleUser(null);
            setNewRole('');
          }
        }}
      />

      <EditStatusDialog
        user={selectedStatusUser}
        open={statusDialogOpen}
        submitting={submitting}
        onSubmit={submitStatusChange}
        onOpenChange={(open) => {
          setStatusDialogOpen(open);

          if (!open) {
            setSelectedStatusUser(null);
          }
        }}
      />
    </PageContainer>
  );
}
