import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
export const API_URL = "https://bibliotecaactiva-api.aaron-navarro.workers.dev/api";


export const api = axios.create({ baseURL: API_URL + "/api" });
export type ApiError = { code?: string; message?: string }; 
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers && !config.url?.startsWith("/auth")) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

},  (error: AxiosError) => { return Promise.reject(error);});

api.interceptors.response.use(
    (response: any) => response,
    (error: AxiosError<ApiError>) => {

        if (error.response?.status === 401 && !error.config?.url?.startsWith("/auth")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

    window.location.href = '/login';
    }
    return Promise.reject(error);
    }
);
export type AppError = { status: number; code: string; message: string };
export function apiError(err: unknown): AppError {
    if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        return { status, code: data?.code ?? "", message: data?.message || `Error ${status}` };
    }
    return { status: 0, code: "NETWORK", message: "No se pudo conectar con el servidor" };
}
export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [version, setVersion] = useState(0);
    useEffect(() => {
        setLoading(true);
        setError("");
        api.get<T>(url)
        .then((res) => setData(res.data))
        .catch((err) => setError(apiError(err).message))
        .finally(() => setLoading(false));
    }, [url, version]);
    return { data, setData, loading, error, reload: () => setVersion((v) => v + 1) };
}
