import type { ReactNode } from "react";

export type ExtraView = { path: string; label: string; element: ReactNode };

type FieldProps = { label: string; error?: string; children: ReactNode };

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="block text-sm text-red-600">{error}</span>}
    </label>
  );
}

type AlertProps = { children: ReactNode; ok?: boolean };

export function Alert({ children, ok = false }: AlertProps) {
  const color = ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700";
  return <p role="alert" className={`rounded p-3 text-sm ${color}`}>{children}</p>;
}

type PaginationProps = { page: number; totalPages: number; onChange: (page: number) => void };

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const total = Math.max(totalPages, 1);
  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-3">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}>Anterior</button>
      <span>Página {page} de {total}</span>
      <button onClick={() => onChange(page + 1)} disabled={page >= total}>Siguiente</button>
    </nav>
  );
}