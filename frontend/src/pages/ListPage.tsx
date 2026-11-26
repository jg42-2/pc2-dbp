import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../api";
import { Alert, Pagination } from "../components/ui";


export type Page<T> = { items: T[]; page: number; size: number; totalItems: number; totalPages: number };

type ListPageProps<T> = { path: string; title: string; render: (item: T) => ReactNode };

export default function ListPage<T extends { id: number }>({ path, title, render }: ListPageProps<T>) {
    const [page, setPage] = useState(0);
    const { data, loading, error, reload } = useFetch<Page<T>>(`${path}?page=${page}&size=5`);
    
    return (
        <section className="space-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
            {loading && <p className="text-gray-500">Cargando...</p>}
            {error && <div className="flex flex-wrap items-center gap-3"><Alert>{error}</Alert><button onClick={reload}>Reintentar</button></div>}
            {!loading && data?.items.length === 0 && <p>No hay registros para mostrar.</p>}
        <ul className="grid gap-2 sm:grid-cols-2">
            {data?.items.map((item) => (
        <li key={item.id}>
            <Link to={`${path}/${item.id}`} className="block h-full rounded border p-3 hover:bg-gray-50">
            {render(item)}
            </Link>
        </li>
    ))}
    </ul>
        {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
    </section>
    );
}
