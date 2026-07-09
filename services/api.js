import { API_URL } from "../constants/config";

let authTokenGetter = null;

export function setAuthTokenGetter(getter) {
    authTokenGetter = getter;
}

async function getAuthToken(options) {
    if (!authTokenGetter) {
        return null;
    }

    return authTokenGetter(options);
}

async function makeRequest(url, options, token) {
    return fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });
}

async function parseResponse(response) {
    const text = await response.text();

    try {
        return text ? JSON.parse(text) : null;
    } catch (error) {
        return null;
    }
}

export async function apiRequest(path, options = {}) {
    const url = `${API_URL}${path}`;
    const method = options.method || "GET";

    let token = await getAuthToken();

    console.log("Subshelf API request:", {
        url,
        method,
        hasToken: !!token,
    });

    try {
        let response = await makeRequest(url, options, token);
        let data = await parseResponse(response);

        console.log("Subshelf API response:", {
            url,
            status: response.status,
            ok: response.ok,
        });

        if (response.status === 401 && token) {
            console.log("Subshelf API retrying with fresh token:", {
                url,
                method,
            });

            token = await getAuthToken({ skipCache: true });

            response = await makeRequest(url, options, token);
            data = await parseResponse(response);

            console.log("Subshelf API retry response:", {
                url,
                status: response.status,
                ok: response.ok,
                hasToken: !!token,
            });
        }

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