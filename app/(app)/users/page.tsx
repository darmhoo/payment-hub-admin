"use client";

import { DataTable } from "@/components/table/app-table";
import React, { useEffect } from "react";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/use-loading";
import { Loader } from "@/components/ui/loader";

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const { loading, withLoading } = useLoading();
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
              <form>
                <DialogTrigger
                  render={<Button variant="outline">Add User</Button>}
                />
                <DialogContent className="sm:max-w-106.25">
                  <DialogHeader className="text-lg font-semibold">
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                      Create new users, they will be added to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    Add a new user to the system.
                  </p>
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
