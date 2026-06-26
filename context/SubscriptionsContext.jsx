import { createContext, useContext, useState } from "react";
import { HOME_SUBSCRIPTIONS } from "../constants/data";

const SubscriptionsContext = createContext(null);

export function SubscriptionsProvider({ children }) {
    const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);

    const addSubscription = (subscription) => {
        setSubscriptions((currentSubscriptions) => [
            subscription,
            ...currentSubscriptions,
        ]);
    };

    return (
        <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
            {children}
        </SubscriptionsContext.Provider>
    );
}

export function useSubscriptions() {
    const context = useContext(SubscriptionsContext);

    if (!context) {
        throw new Error("useSubscriptions must be used inside SubscriptionsProvider");
    }

    return context;
}