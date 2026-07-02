import { apiRequest } from "./api";

export function getSubscriptions() {
    return apiRequest("/api/subscriptions");
}

export function createSubscription(subscription) {
    return apiRequest("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify(subscription),
    });
}

export function updateSubscription(id, subscription) {
    return apiRequest(`/api/subscriptions/${id}`, {
        method: "PUT",
        body: JSON.stringify(subscription),
    });
}

export function deleteSubscription(id) {
    return apiRequest(`/api/subscriptions/${id}`, {
        method: "DELETE",
    });
}

export function updateSubscriptionStatus(id, status) {
    return apiRequest(`/api/subscriptions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}