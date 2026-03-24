"use client";

import { AdminUserRole } from "./types";

export type UserFormValues = {
  name: string;
  uniqueCode: string;
  role: AdminUserRole;
  isActive: boolean;
};

type UserFormProps = {
  mode: "add" | "edit";
  values: UserFormValues;
  onChange: (values: UserFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function UserForm({
  mode,
  values,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: UserFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800">
          {mode === "add" ? "Add User" : "Edit User"}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "add"
            ? "Tambahkan akun user baru untuk Todoro."
            : "Perbarui data user yang dipilih."}
        </p>

        <div className="mt-4 grid gap-3">
          <input
            type="text"
            value={values.name}
            onChange={(event) => onChange({ ...values, name: event.target.value })}
            placeholder="Nama user"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
          />
          <input
            type="text"
            value={values.uniqueCode}
            onChange={(event) => onChange({ ...values, uniqueCode: event.target.value.toUpperCase() })}
            placeholder="Unique code"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
          />
          <select
            value={values.role}
            onChange={(event) => onChange({ ...values, role: event.target.value as AdminUserRole })}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-400"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="button"
            onClick={() => onChange({ ...values, isActive: !values.isActive })}
            className={`inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              values.isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-300 bg-white text-slate-600"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${values.isActive ? "bg-emerald-600" : "bg-slate-400"}`}
            />
            Active: {values.isActive ? "Yes" : "No"}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Menyimpan..." : mode === "add" ? "Tambah User" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
