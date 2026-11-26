import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {api, apiError} from "../api";
import {Alert, Field} from "../components/ui"

export default function Register(){
    const [form, setForm] = useState({name: "", email :"", password: ""});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        setForm({...form, [e.target.name]: e.target.value});

    const validate = () => {
        const e: Record<string, string> = {};
        const name = form.name.trim();
        if(!name || name.length>100) e.name = "Ingresa un nombre de hasta 100 caracteres";
        if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(form.email)) e.email = "Ingresa un correo válido.";
        if (form.password.length < 8 || form.password.length > 72) e.password = "La contraseña debe tener de 8 a 72 caracteres.";
    return e;
};
    const onSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        setError("");
        try {
            await api.post("/auth/register", { ...form, name: form.name.trim() });
            navigate("/login");
        } catch (err) {
        setError(apiError(err).message);
    }
};
return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 max-w-sm space-y-4 rounded border p-6">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <Field label="Nombre" error={errors.name}>
            <input name="name" value={form.name} onChange={onChange} />
        </Field>
        <Field label="Correo" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={onChange} />
        </Field>
        <Field label="Contraseña" error={errors.password}>
            <input name="password" type="password" value={form.password} onChange={onChange} />
        </Field>
        {error && <Alert>{error}</Alert>}
        <button type="submit" className="w-full">Registrarme</button>
        <p className="text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 underline">Inicia sesión</Link></p>
    </form>
);
}
