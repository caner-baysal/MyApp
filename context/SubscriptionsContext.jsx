import { createContext, useContext, useMemo, useState } from "react";
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

  const updateSubscription = (subscriptionId, updates) => {
    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.map((subscription) =>
        subscription.id === subscriptionId
          ? { ...subscription, ...updates }
          : subscription
      )
    );
  };

  const deleteSubscription = (subscriptionId) => {
    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.filter(
        (subscription) => subscription.id !== subscriptionId
      )
    );
  };

  const setSubscriptionStatus = (subscriptionId, status) => {
    updateSubscription(subscriptionId, { status });
  };

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) => !subscription.status || subscription.status === "active"
      ),
    [subscriptions]
  );

  const value = {
    subscriptions,
    activeSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    setSubscriptionStatus,
  };

  return (
    <SubscriptionsContext.Provider value={value}>
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