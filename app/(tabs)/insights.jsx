import { useMemo } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { useSubscriptions } from "../../context/SubscriptionsContext";
import { colors } from "../../constants/theme";
import { formatCurrency } from "../../constants/utils";

export default function Insights() {
  const { subscriptions } = useSubscriptions();

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) => !subscription.status || subscription.status === "active"
      ),
    [subscriptions]
  );

  const pausedSubscriptions = useMemo(
    () =>
      subscriptions.filter((subscription) => subscription.status === "paused"),
    [subscriptions]
  );

  const upcomingRenewals = useMemo(() => {
    const today = dayjs().startOf("day");

    return activeSubscriptions
      .map((subscription) => {
        const renewalDate = dayjs(subscription.renewalDate);

        if (!renewalDate.isValid()) return null;

        return {
          ...subscription,
          daysLeft: renewalDate.startOf("day").diff(today, "day"),
        };
      })
      .filter((subscription) => subscription && subscription.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [activeSubscriptions]);

  const renewalsThisMonth = useMemo(() => {
    const startOfMonth = dayjs().startOf("month");
    const endOfMonth = dayjs().endOf("month");

    return activeSubscriptions.filter((subscription) => {
      const renewalDate = dayjs(subscription.renewalDate);

      return (
        renewalDate.isValid() &&
        renewalDate.isAfter(startOfMonth.subtract(1, "day")) &&
        renewalDate.isBefore(endOfMonth.add(1, "day"))
      );
    });
  }, [activeSubscriptions]);

  const monthlySpendByCurrency = useMemo(() => {
    return activeSubscriptions.reduce((totals, subscription) => {
      const itemCurrency = subscription.currency || "USD";
      const price = Number(subscription.price) || 0;
      const billing = subscription.billing?.toLowerCase();

      const monthlyPrice = billing === "yearly" ? price / 12 : price;

      return {
        ...totals,
        [itemCurrency]: (totals[itemCurrency] || 0) + monthlyPrice,
      };
    }, {});
  }, [activeSubscriptions]);

  const monthlySpendRows = Object.entries(monthlySpendByCurrency);
  const nextRenewal = upcomingRenewals[0];

  const insightCards = [
    {
      label: "Active subscriptions",
      value: String(activeSubscriptions.length),
      detail:
        pausedSubscriptions.length > 0
          ? `${pausedSubscriptions.length} paused`
          : "No paused subscriptions",
    },
    {
      label: "Renewals this month",
      value: String(renewalsThisMonth.length),
      detail: dayjs().format("MMMM YYYY"),
    },
    {
      label: "Next renewal",
      value: nextRenewal ? nextRenewal.name : "None",
      detail: nextRenewal
        ? dayjs(nextRenewal.renewalDate).format("MMM D")
        : "No upcoming renewals",
    },
    {
      label: "Currencies tracked",
      value: String(monthlySpendRows.length || 1),
      detail:
        monthlySpendRows.length > 0
          ? monthlySpendRows.map(([currency]) => currency).join(", ")
          : "USD",
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingTop: 14,
      }}
    >
      <FlatList
        data={upcomingRenewals.slice(0, 8)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={() => (
          <>
            <Text
              style={{
                fontSize: 30,
                fontFamily: "sans-extrabold",
                color: colors.primary,
                marginBottom: 18,
              }}
            >
              Insights
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 22,
              }}
            >
              {insightCards.map((card) => (
                <View
                  key={card.label}
                  style={{
                    width: "48%",
                    minHeight: 128,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    padding: 16,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "sans-semibold",
                      color: colors.mutedForeground,
                    }}
                  >
                    {card.label}
                  </Text>

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                    style={{
                      marginTop: 12,
                      fontSize: 24,
                      fontFamily: "sans-extrabold",
                      color: colors.primary,
                    }}
                  >
                    {card.value}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      fontFamily: "sans-semibold",
                      color: colors.mutedForeground,
                    }}
                  >
                    {card.detail}
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={{
                borderRadius: 22,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
                padding: 16,
                marginBottom: 28,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "sans-bold",
                  color: colors.primary,
                  marginBottom: 6,
                }}
              >
                Monthly spend
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "sans-semibold",
                  color: colors.mutedForeground,
                  marginBottom: 16,
                }}
              >
                Grouped by currency. Exchange rates are not applied.
              </Text>

              {monthlySpendRows.length > 0 ? (
                monthlySpendRows.map(([itemCurrency, amount]) => (
                  <View
                    key={itemCurrency}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 10,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "sans-bold",
                        color: colors.primary,
                      }}
                    >
                      {itemCurrency}
                    </Text>

                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "sans-extrabold",
                        color: colors.primary,
                      }}
                    >
                      {formatCurrency(amount, itemCurrency)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    paddingVertical: 12,
                    fontSize: 15,
                    fontFamily: "sans-medium",
                    color: colors.mutedForeground,
                  }}
                >
                  No active subscription spend yet.
                </Text>
              )}
            </View>

            <Text
              style={{
                fontSize: 22,
                fontFamily: "sans-bold",
                color: colors.primary,
                marginBottom: 16,
              }}
            >
              Upcoming renewals
            </Text>
          </>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
              backgroundColor: item.color || colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={item.icon}
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                marginRight: 14,
              }}
            />

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 18,
                  fontFamily: "sans-bold",
                  color: colors.primary,
                  marginBottom: 6,
                }}
              >
                {item.name}
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: "sans-semibold",
                  color: colors.mutedForeground,
                }}
              >
                {dayjs(item.renewalDate).format("MMM D")} ·{" "}
                {item.daysLeft === 0
                  ? "Today"
                  : `${item.daysLeft} days left`}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "sans-bold",
                  color: colors.primary,
                  marginBottom: 6,
                }}
              >
                {formatCurrency(item.price, item.currency || "USD")}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "sans-semibold",
                  color: colors.mutedForeground,
                }}
              >
                {item.billing || "Monthly"}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              paddingVertical: 24,
              textAlign: "center",
              fontSize: 15,
              fontFamily: "sans-medium",
              color: colors.mutedForeground,
            }}
          >
            No upcoming renewals yet.
          </Text>
        )}
      />
    </SafeAreaView>
  );
}