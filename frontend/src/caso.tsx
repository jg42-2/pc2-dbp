import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { api, apiError, useFetch } from "./api";
import { Alert, Field } from "./components/ui";
import type { ExtraView } from "./components/ui";

export const PATH = "/materials";
export const HOME = "/dashboard";
export const TITLE = "BibliotecaActiva";
const MIN = 1;
const MAX = 7;
const NO_COPIES = "NO_COPIES";
const NO_COPIES_MSG = "El material ya no tiene copias disponibles, F nomas";
const INVALID_STATE = "INVALID_STATE";


export type Item = { id: number; title: string; author: string; category: string; availableCopies: number; description: string };
type Detail = Item;
type Loan = { id: number; resourceId: number; resourceName: string; days: number; status: string };
export function ItemCard({ item }: { item: Item }) {
return (
    <>
        <p className="font-semibold">{item.title}</p>
        <p className="text-sm text-gray-600">
        Autor: {item.author} · Categoría: {item.category} · Copias disponibles: {item.availableCopies}
        </p>
    </>
);
}
export function DetailPage() {
    const { id } = useParams();
    const { data, loading, error, reload } = useFetch<Detail>(`${PATH}/${id}`);
    const [form, setForm] = useState({ attendees: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [result, setResult] = useState("");
    const [apiErr, setApiErr] = useState("");
    const [sending, setSending] = useState(false);
        if (!data) return loading ? <p>Cargando...</p> : <Alert>{error}</Alert>;
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    const validate = () => {
    const e: Record<string, string> = {};
    const n = Number(form.attendees);
    if (form.attendees === "" || !Number.isInteger(n) || n < MIN || n > MAX)
    e.attendees = `Ingresa un número entero entre ${MIN} y ${MAX}.`;
    return e;
};
    const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setResult("");
    setApiErr("");
    if (Object.keys(e).length > 0) return;
    setSending(true);
try {
await api.post(`${PATH}/${id}/loans`, { attendees: Number(form.attendees) });
    setResult("Reserva confirmada.");
    setForm({ attendees: "" });
    reload(); 
} catch (err) {
const x = apiError(err);
setApiErr(x.code === NO_COPIES ? NO_COPIES_MSG : x.message);
if (x.code === NO_COPIES) reload();
} finally {
setSending(false);
}
};
}
