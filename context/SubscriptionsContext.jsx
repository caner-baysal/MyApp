import { useAuth } from "@clerk/expo";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createSubscription as createSubscriptionRequest,
  deleteSubscription as deleteSubscriptionRequest,
  getSubscriptions,
  updateSubscription as updateSubscriptionRequest,
  updateSubscriptionStatus as updateSubscriptionStatusRequest,
} from "../services/subscriptionsApi";
import { setAuthTokenGetter } from "../services/api";
import { syncRenewalNotifications } from "../services/notifications";

const SubscriptionsContext = createContext(null);

export function SubscriptionsProvider({ children }) {
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [subscriptionsError, setSubscriptionsError] = useState("");

  useEffect(() => {
    setAuthTokenGetter(async () => {
      if (!authLoaded || !isSignedIn) {
        return null;
      }

      return getToken();
    });
  }, [authLoaded, isSignedIn, getToken]);

  const loadSubscriptions = async () => {
    if (!authLoaded) {
      return;
    }

    if (!isSignedIn) {
      setSubscriptions([]);
      setSubscriptionsError("");
      setIsLoadingSubscriptions(false);
      return;
    }

    setIsLoadingSubscriptions(true);
    setSubscriptionsError("");

    try {
      const data = await getSubscriptions();
      setSubscriptions(data || []);
    } catch (error) {
      setSubscriptionsError(error.message || "Could not load subscriptions.");
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [authLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoadingSubscriptions && isSignedIn) {
      syncRenewalNotifications(subscriptions).catch((error) => {
        console.log("Notification sync error:", error);
      });
    }
  }, [subscriptions, isLoadingSubscriptions, isSignedIn]);

  const addSubscription = async (subscription) => {
    const createdSubscription = await createSubscriptionRequest(subscription);

    setSubscriptions((currentSubscriptions) => [
      createdSubscription,
      ...currentSubscriptions,
    ]);

    return createdSubscription;
  };

  const updateSubscription = async (id, updates) => {
    const updatedSubscription = await updateSubscriptionRequest(id, updates);

    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.map((subscription) =>
        subscription.id === id ? updatedSubscription : subscription
      )
    );

    return updatedSubscription;
  };

  const removeSubscription = async (id) => {
    await deleteSubscriptionRequest(id);

    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.filter((subscription) => subscription.id !== id)
    );
  };

  const updateSubscriptionStatus = async (id, status) => {
    const updatedSubscription = await updateSubscriptionStatusRequest(id, status);

    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.map((subscription) =>
        subscription.id === id ? updatedSubscription : subscription
      )
    );

    return updatedSubscription;
  };

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        isLoadingSubscriptions,
        subscriptionsError,
        loadSubscriptions,
        addSubscription,
        updateSubscription,
        removeSubscription,
        updateSubscriptionStatus,
      }}
    >
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