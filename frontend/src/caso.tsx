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
    const [form, setForm] = useState({ days: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [result, setResult] = useState("");
    const [apiErr, setApiErr] = useState("");
    const [sending, setSending] = useState(false);
        if (!data) return loading ? <p>Cargando...</p> : <Alert>{error}</Alert>;
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    const validate = () => {
    const e: Record<string, string> = {};
    const n = Number(form.days);
    if (form.days === "" || !Number.isInteger(n) || n < MIN || n > MAX)
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
await api.post(`${PATH}/${id}/loans`, { days: Number(form.days) });
    setResult("Reserva confirmada.");
    setForm({ days: "" });
    reload(); 
} catch (err) {
    const x = apiError(err);
    setApiErr(x.code === NO_COPIES ? NO_COPIES_MSG : x.message);
    if (x.code === NO_COPIES) reload();
    } finally {
setSending(false);
}
};
return (
<section className="space-y-4">
<Link to={HOME} className="text-blue-600 underline">← Volver al dashboard</Link>
<h1 className="text-2xl font-bold">{data.title}</h1>
<p>{data.description}</p>
<p>Autor: {data.author} · Categoria: {data.category} · Copias disponibles: {data.availableCopies}</p>
<form onSubmit={onSubmit} noValidate className="space-y-3 rounded border p-4">
<Field label="Número de asistentes" error={errors.attendees}>
<input name="attendees" type="number" min={MIN} max={MAX} step={1} value={form.days} onChange={onChange} />
</Field>
{apiErr && <Alert>{apiErr}</Alert>}
{result && <Alert ok>{result}</Alert>}
<button type="submit" disabled={sending}>{sending ? "Enviando..." : "Reservar"}</button>
</form>
<Link to="/my-loans" className="text-blue-600 underline">Ver mis préstamos</Link>
</section>
);
}
function MyLoansPage() {
    const { data, loading, error, reload } = useFetch<Loan[]>("/me/loans");
    const [msg, setMsg] = useState("");
const [apiErr, setApiErr] = useState("");
const cancel = async (l: Loan) => {
if (!window.confirm(`¿Cancelar la reserva #${l.id} de ${l.resourceName}?`)) return;
setMsg("");
setApiErr("");
try {
await api.patch(`/loans/${l.id}/cancel`);
setMsg(`Reserva #${l.id} cancelada.`);
} catch (err) {
const x = apiError(err);
setApiErr(x.code === INVALID_STATE ? "El préstamo cambió de estado. Se actualizó la lista." : x.message);
}
reload(); 
};
return (
<section className="space-y-4">
<h1 className="text-2xl font-bold">Mis préstamos</h1>
{loading && <p className="text-gray-500">Cargando...</p>}
{error && <div className="flex flex-wrap items-center gap-3"><Alert>{error}</Alert><button onClick={reload}>Reintentar</button></div>}
{msg && <Alert ok>{msg}</Alert>}
{apiErr && <Alert>{apiErr}</Alert>}
{!loading && data?.length === 0 && <p>Todavía no tienes préstamos.</p>}
<ul className="space-y-2">
{data?.map((l) => (
<li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded border p-3">
<p>#{l.id} · <span className="font-semibold">{l.resourceName}</span> · {l.days} día(s) · {l.status === "ACTIVE" ? "Activa" : "Cancelada"}</p>
{l.status === "ACTIVE" && <button onClick={() => cancel(l)}>Cancelar</button>}
</li>
))}
</ul>
</section>
);
}
export const EXTRA: ExtraView[] = [{ path: "/my-loans", label: "Mis reservas", element: <MyLoansPage /> }];

