"use client";

import { AdminUserRecord } from "./types";

type UserTableProps = {
  rows: AdminUserRecord[];
  onEdit: (row: AdminUserRecord) => void;
  onToggleActive: (row: AdminUserRecord) => void;
  onViewDetail: (row: AdminUserRecord) => void;
};

export function UserTable({ rows, onEdit, onToggleActive, onViewDetail }: UserTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-3 py-3 font-semibold">Nama</th>
              <th className="px-3 py-3 font-semibold">Unique Code</th>
              <th className="px-3 py-3 font-semibold">Role</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Created At</th>
              <th className="px-3 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-3 py-3 text-slate-800">{row.name}</td>
                <td className="px-3 py-3 text-slate-700">{row.uniqueCode}</td>
                <td className="px-3 py-3 text-slate-700">{row.role}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      row.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-600">{row.createdAtLabel}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetail(row)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                    >
                      View Detail
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleActive(row)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                    >
                      {row.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
