import { useMemo, useState } from "react";
import { FlatList, Image, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { useSubscriptions } from "../../context/SubscriptionsContext";
import { colors } from "../../constants/theme";
import { formatCurrency } from "../../constants/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];

const getDayIndex = (date) => {
  const jsDay = dayjs(date).day();
  return jsDay === 0 ? 6 : jsDay - 1;
};

export default function Insights() {
  const { subscriptions } = useSubscriptions();
  const [selectedDayIndex, setSelectedDayIndex] = useState(dayjs().day() === 0 ? 6 : dayjs().day() - 1);

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) => !subscription.status || subscription.status === "active"
      ),
    [subscriptions]
  );

  const weeklyTotals = useMemo(() => {
    const totals = Array(7).fill(0);

    activeSubscriptions.forEach((subscription) => {
      const renewalDate = dayjs(subscription.renewalDate);

      if (!renewalDate.isValid()) return;

      const dayIndex = getDayIndex(renewalDate);
      totals[dayIndex] += Number(subscription.price) || 0;
    });

    return totals;
  }, [activeSubscriptions]);

  const maxWeeklyTotal = Math.max(...weeklyTotals, 1);
  const highlightedIndex = weeklyTotals.indexOf(maxWeeklyTotal);

  const getMonthlyEquivalentPrice = (subscription) => {
    const price = Number(subscription.price) || 0;
    const billing = subscription.billing?.toLowerCase();

    if (billing === "yearly") {
      return price / 12;
    }

    return price;
  };

  const getExpensesForMonth = (monthDate) => {
    const monthEnd = monthDate.endOf("month");

    return activeSubscriptions.reduce((total, subscription) => {
      const startDate = dayjs(subscription.startDate);

      if (startDate.isValid() && startDate.isAfter(monthEnd)) {
        return total;
      }

      return total + getMonthlyEquivalentPrice(subscription);
    }, 0);
  };

  const currentMonthExpenses = useMemo(() => {
    return getExpensesForMonth(dayjs());
  }, [activeSubscriptions]);

  const previousMonthExpenses = useMemo(() => {
    return getExpensesForMonth(dayjs().subtract(1, "month"));
  }, [activeSubscriptions]);

  const expenseChangeLabel = useMemo(() => {
    if (previousMonthExpenses === 0 && currentMonthExpenses > 0) {
      return "New";
    }

    if (previousMonthExpenses === 0) {
      return "0%";
    }

    const change =
      ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) *
      100;

    const sign = change > 0 ? "+" : "";

    return `${sign}${change.toFixed(0)}%`;
  }, [currentMonthExpenses, previousMonthExpenses]);

  const historyItems = useMemo(() => {
    return [...activeSubscriptions]
      .sort((a, b) => dayjs(b.renewalDate).valueOf() - dayjs(a.renewalDate).valueOf())
      .slice(0, 6);
  }, [activeSubscriptions]);

  const periodLabel = dayjs().format("MMMM YYYY");

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
        data={historyItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 34,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "sans-bold",
                  color: colors.primary,
                }}
              >
                Monthly Insights
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "sans-bold",
                  color: colors.primary,
                }}
              >
                Upcoming
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 9999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "sans-semibold",
                    color: colors.primary,
                  }}
                >
                  View all
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 266,
                borderRadius: 18,
                backgroundColor: colors.muted,
                paddingHorizontal: 16,
                paddingTop: 28,
                paddingBottom: 16,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                {weeklyTotals.map((amount, index) => {
                  const active = index === selectedDayIndex && amount > 0;
                  const height = Math.max(12, (amount / maxWeeklyTotal) * 170);

                  return (
                    <Pressable
                      key={weekDays[index]}
                      onPress={() => setSelectedDayIndex(index)}
                      style={{
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flex: 1,
                      }}
                    >
                      {active && (
                        <View
                          style={{
                            backgroundColor: "#ffffff",
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 5,
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.accent,
                              fontFamily: "sans-bold",
                              fontSize: 12,
                            }}
                          >
                            {formatCurrency(amount)}
                          </Text>
                        </View>
                      )}

                      <View
                        style={{
                          width: 12,
                          height,
                          borderRadius: 9999,
                          backgroundColor: active ? colors.accent : colors.primary,
                        }}
                      />

                      <Text
                        style={{
                          marginTop: 14,
                          fontSize: 13,
                          fontFamily: "sans-semibold",
                          color: "rgba(8, 17, 38, 0.65)",
                        }}
                      >
                        {weekDays[index]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 16,
                padding: 14,
                marginBottom: 34,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "sans-bold",
                    color: colors.primary,
                    marginBottom: 6,
                  }}
                >
                  Expenses
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "sans-semibold",
                    color: colors.mutedForeground,
                  }}
                >
                  {periodLabel}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "sans-extrabold",
                    color: colors.primary,
                    marginBottom: 6,
                  }}
                >
                  -{formatCurrency(currentMonthExpenses)}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "sans-semibold",
                    color: colors.mutedForeground,
                  }}
                >

                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "sans-bold",
                  color: colors.primary,
                }}
              >
                History
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 9999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "sans-semibold",
                    color: colors.primary,
                  }}
                >
                  View all
                </Text>
              </View>
            </View>
          </>
        )}
        renderItem={({ item, index }) => (
          <View
            style={{
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              backgroundColor: item.color || (index % 2 === 0 ? "#f5c542" : "#b8e8d0"),
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={item.icon}
              style={{
                width: 56,
                height: 56,
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
                {dayjs(item.renewalDate).format("MMM D, HH:mm")}
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
                {formatCurrency(item.price, item.currency)}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "sans-semibold",
                  color: colors.mutedForeground,
                }}
              >
                per {item.billing?.toLowerCase() || "month"}
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
            No payment history yet.
          </Text>
        )}
      />
    </SafeAreaView>
  );
}