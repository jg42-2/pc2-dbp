import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiError } from "../api";
import { Alert, Field } from "../components/ui";
import { HOME } from "../caso";

export default function Login(){
    const [form, setForm] = useState({email :"", password: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        setForm({...form, [e.target.name]: e.target.value});

    const onSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        setError("");
        try {
            const { data } = await api.post<{ token: string }>("/auth/login", form);
            localStorage.setItem("token", data.token);
        navigate(HOME);
        } catch (err) {
            const e = apiError(err);
            setError(e.status === 401 ? "Correo o contraseña incorrectos." : e.message);
        }
    };

    return (
        <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 max-w-sm space-y-4 rounded border p-6">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <Field label="Correo">
        <input name="email" type="email" value={form.email} onChange={onChange} required />
        </Field>

        <Field label="Contraseña">
            <input name="password" type="password" value={form.password} onChange={onChange} />
        </Field>
        {error && <Alert>{error}</Alert>}
        <button type="submit" className="w-full">Entrar</button>
        <p className="text-sm">¿No tienes cuenta? <Link to="/login" className="text-blue-600 underline">Inicia sesión</Link></p>
    </form>

    );

};
