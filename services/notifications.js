import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import dayjs from "dayjs";
import { formatCurrency } from "../constants/utils";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function requestNotificationPermission() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("renewals", {
            name: "Renewal reminders",
            importance: Notifications.AndroidImportance.HIGH,
        });
    }

    const existingPermission = await Notifications.getPermissionsAsync();

    if (existingPermission.status === "granted") {
        return true;
    }

    const requestedPermission = await Notifications.requestPermissionsAsync();

    return requestedPermission.status === "granted";
}

export async function syncRenewalNotifications(subscriptions) {
    const hasPermission = await requestNotificationPermission();

    if (!hasPermission) {
        return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = dayjs();

    const activeSubscriptions = subscriptions.filter(
        (subscription) =>
            (!subscription.status || subscription.status === "active") &&
            subscription.renewalDate
    );

    for (const subscription of activeSubscriptions) {
        const renewalDate = dayjs(subscription.renewalDate).subtract(1, "day")
            .hour(9)
            .minute(0)
            .second(0)
            .millisecond(0);

        if (!renewalDate.isValid() || renewalDate.isBefore(now)) {
            continue;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `${subscription.name} renews today`,
                body: `${formatCurrency(
                    subscription.price,
                    subscription.currency || "USD"
                )} ${subscription.billing || ""} payment is due today.`,
                data: {
                    subscriptionId: subscription.id,
                    url: "/subscriptions",
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: renewalDate.toDate(),
                channelId: "renewals",
            },
        });
        /*await Notifications.scheduleNotificationAsync({
            content: {
                title: `${subscription.name} renews today`,
                body: `${formatCurrency(
                    subscription.price,
                    subscription.currency || "USD"
                )} ${subscription.billing || ""} payment is due today.`,
                data: {
                    subscriptionId: subscription.id,
                    url: "/subscriptions",
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 15,
                channelId: "renewals",
            },
        }); //notification trial*/
    }
}