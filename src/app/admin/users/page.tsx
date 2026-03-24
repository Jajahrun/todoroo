"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AdminEmptyState } from "../../../components/admin/empty-state";
import { UserForm, UserFormValues } from "../../../components/admin/user-form";
import { UserTable } from "../../../components/admin/user-table";
import { AdminUserRecord } from "../../../components/admin/types";

type FormMode = "add" | "edit";

const defaultFormValues: UserFormValues = {
  name: "",
  uniqueCode: "",
  role: "user",
  isActive: true,
};

type UsersResponse = {
  success: boolean;
  message?: string;
  users?: AdminUserRecord[];
};

type MutationResponse = {
  success: boolean;
  message?: string;
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<UserFormValues>(defaultFormValues);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => a.name.localeCompare(b.name)),
    [rows]
  );

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      setMessageType("");

      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const result = (await response.json()) as UsersResponse;
      if (!response.ok || !result.success) {
        setRows([]);
        setMessageType("error");
        setMessage(result.message ?? "Gagal memuat data user.");
        return;
      }

      setRows(result.users ?? []);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setRows([]);
      setMessageType("error");
      setMessage(`Gagal memuat data user: ${detail}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const openAddForm = () => {
    setFormMode("add");
    setEditingUserId(null);
    setFormValues(defaultFormValues);
    setIsFormOpen(true);
  };

  const openEditForm = (row: AdminUserRecord) => {
    setFormMode("edit");
    setEditingUserId(row.id);
    setFormValues({
      name: row.name,
      uniqueCode: row.uniqueCode,
      role: row.role,
      isActive: row.isActive,
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async () => {
    const name = formValues.name.trim();
    const uniqueCode = formValues.uniqueCode.trim().toUpperCase();

    if (!name) {
      setMessageType("error");
      setMessage("Nama user wajib diisi.");
      return;
    }

    if (!uniqueCode) {
      setMessageType("error");
      setMessage("Unique code wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      setMessageType("");

      const body = JSON.stringify({
        name,
        uniqueCode,
        role: formValues.role,
        isActive: formValues.isActive,
      });

      const targetUrl =
        formMode === "add" ? "/api/admin/users" : `/api/admin/users/${editingUserId}`;
      const method = formMode === "add" ? "POST" : "PUT";

      const response = await fetch(targetUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const result = (await response.json()) as MutationResponse;
      if (!response.ok || !result.success) {
        setMessageType("error");
        setMessage(result.message ?? "Gagal menyimpan data user.");
        return;
      }

      setMessageType("success");
      setMessage(formMode === "add" ? "User berhasil ditambahkan." : "Data user berhasil diperbarui.");
      setIsFormOpen(false);
      setFormValues(defaultFormValues);
      setEditingUserId(null);
      await fetchUsers();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setMessageType("error");
      setMessage(`Gagal menyimpan data user: ${detail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (row: AdminUserRecord) => {
    try {
      setMessage("");
      setMessageType("");

      const response = await fetch(`/api/admin/users/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: row.name,
          uniqueCode: row.uniqueCode,
          role: row.role,
          isActive: !row.isActive,
        }),
      });

      const result = (await response.json()) as MutationResponse;
      if (!response.ok || !result.success) {
        setMessageType("error");
        setMessage(result.message ?? "Gagal memperbarui status user.");
        return;
      }

      setMessageType("success");
      setMessage(`Status ${row.name} berhasil diperbarui.`);
      await fetchUsers();
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      setMessageType("error");
      setMessage(`Gagal update status user: ${detail}`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Users</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola akun user Todoro dari satu halaman.</p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {message ? (
          <p className={`mt-4 text-sm ${messageType === "error" ? "text-rose-600" : "text-emerald-700"}`}>
            {message}
          </p>
        ) : null}
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Memuat data user...
        </div>
      ) : sortedRows.length === 0 ? (
        <AdminEmptyState
          title="Belum ada user"
          description="Tambahkan user baru agar admin dapat memantau aktivitas produktivitas."
        />
      ) : (
        <UserTable
          rows={sortedRows}
          onEdit={openEditForm}
          onToggleActive={handleToggleActive}
          onViewDetail={(row) => setSelectedUser(row)}
        />
      )}

      {selectedUser ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">User Detail</h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              Nama: <span className="font-semibold text-slate-800">{selectedUser.name}</span>
            </p>
            <p>
              Unique Code:{" "}
              <span className="font-semibold text-slate-800">{selectedUser.uniqueCode}</span>
            </p>
            <p>
              Role: <span className="font-semibold text-slate-800">{selectedUser.role}</span>
            </p>
            <p>
              Status:{" "}
              <span className="font-semibold text-slate-800">
                {selectedUser.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p>
              Dibuat:{" "}
              <span className="font-semibold text-slate-800">{selectedUser.createdAtLabel}</span>
            </p>
          </div>
        </section>
      ) : null}

      {isFormOpen ? (
        <UserForm
          mode={formMode}
          values={formValues}
          onChange={setFormValues}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingUserId(null);
            setFormValues(defaultFormValues);
          }}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </div>
  );
}
