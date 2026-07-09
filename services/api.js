import { API_URL } from "../constants/config";

let authTokenGetter = null;

export function setAuthTokenGetter(getter) {
    authTokenGetter = getter;
}

export async function apiRequest(path, options = {}) {
    const token = authTokenGetter ? await authTokenGetter() : null;
    const url = `${API_URL}${path}`;
    const method = options.method || "GET";

    console.log("Subshelf API request:", {
        url,
        method,
        hasToken: !!token,
    });

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(options.headers || {}),
            },
            ...options,
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        console.log("Subshelf API response:", {
            url,
            status: response.status,
            ok: response.ok,
        });

        if (!response.ok) {
            const message = data?.message || "Something went wrong.";
            throw new Error(message);
        }

        return data;
    } catch (error) {
        console.log("Subshelf API fetch error:", {
            url,
            method,
            message: error?.message,
            name: error?.name,
        });

        throw error;
    }
}