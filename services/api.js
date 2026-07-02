import { API_URL } from "../constants/config";

let authTokenGetter = null;

export function setAuthTokenGetter(getter) {
    authTokenGetter = getter;
}

export async function apiRequest(path, options = {}) {
    const token = authTokenGetter ? await authTokenGetter() : null;

    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const message = data?.message || "Something went wrong.";
        throw new Error(message);
    }

    return data;
}