import { useMemo, useState } from "react";
import { Alert, Text, View, Image, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { colors } from "../../constants/theme";
import { icons } from "../../constants/icons";
import { formatCurrency } from "../../constants/utils";
import ListHeading from "../../components/ListHeading";
import UpcomingSubscriptionCard from "../../components/UpcomingSubscriptionCard";
import SubscriptionCard from "../../components/SubscriptionCard";
import CreateSubscriptionModal from "../../components/CreateSubscriptionModal";
import { useSubscriptions } from "../../context/SubscriptionsContext";
import { useRouter } from "expo-router";

export default function Home() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const router = useRouter();

  const { user } = useUser();

  const {
    subscriptions,
    isLoadingSubscriptions,
    subscriptionsError,
    addSubscription,
    updateSubscription,
    removeSubscription,
    updateSubscriptionStatus,
  } = useSubscriptions();


  const upcomingSubscriptions = useMemo(() => {
    const today = dayjs().startOf("day");

    return subscriptions
      .map((subscription) => {
        const renewalDate = dayjs(subscription.renewalDate);

        if (!renewalDate.isValid()) {
          return null;
        }

        const daysLeft = renewalDate.startOf("day").diff(today, "day");

        return {
          ...subscription,
          daysLeft,
        };
      })
      .filter((subscription) => {
        if (!subscription) return false;
        if (subscription.status && subscription.status !== "active") return false;

        return subscription.daysLeft >= 0 && subscription.daysLeft <= 30;
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [subscriptions]);

  const monthlyTotalsByCurrency = useMemo(() => {
    return subscriptions.reduce((totals, subscription) => {
      if (subscription.status && subscription.status !== "active") {
        return totals;
      }

      const itemCurrency = subscription.currency || "USD";
      const price = Number(subscription.price) || 0;
      const billing = subscription.billing?.toLowerCase();

      const monthlyPrice = billing === "yearly" ? price / 12 : price;

      return {
        ...totals,
        [itemCurrency]: (totals[itemCurrency] || 0) + monthlyPrice,
      };
    }, {});
  }, [subscriptions]);

  const monthlyTotalRows = Object.entries(monthlyTotalsByCurrency);

  const handleCreateSubscription = async (subscription) => {
    try {
      const createdSubscription = await addSubscription(subscription);
      setExpandedSubscriptionId(createdSubscription.id);
    } catch (error) {
      Alert.alert(
        "Subscription error",
        error.message || "Could not create subscription."
      );
    }
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setCreateModalVisible(true);
  };

  const handleCloseModal = () => {
    setCreateModalVisible(false);
    setEditingSubscription(null);
  };

  const handleDeleteSubscription = (subscription) => {
    Alert.alert(
      "Delete subscription",
      `Delete ${subscription.name}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeSubscription(subscription.id);

              if (expandedSubscriptionId === subscription.id) {
                setExpandedSubscriptionId(null);
              }
            } catch (error) {
              Alert.alert(
                "Delete error",
                error.message || "Could not delete subscription."
              );
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (subscription) => {
    const isActive = !subscription.status || subscription.status === "active";

    try {
      await updateSubscriptionStatus(
        subscription.id,
        isActive ? "paused" : "active"
      );
    } catch (error) {
      Alert.alert(
        "Status error",
        error.message || "Could not update subscription status."
      );
    }
  };

  const handleUpdateSubscription = async (id, updates) => {
    try {
      await updateSubscription(id, updates);
      handleCloseModal();
    } catch (error) {
      Alert.alert(
        "Update error",
        error.message || "Could not update subscription."
      );
    }
  };

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Welcome";

  const avatarUrl = user?.imageUrl;
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 5,
      }}
    >
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 9999,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 9999,
                      backgroundColor: colors.accent,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 24,
                        fontFamily: "sans-bold",
                      }}
                    >
                      {avatarInitial}
                    </Text>
                  </View>
                )}

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    marginLeft: 16,
                    flex: 1,
                    fontSize: 20,
                    fontFamily: "sans-bold",
                    color: colors.primary,
                  }}
                >
                  {displayName}
                </Text>
              </View>

              <Pressable onPress={() => setCreateModalVisible(true)}>
                <Image
                  source={icons.add}
                  style={{
                    width: 36,
                    height: 36,
                    borderWidth: 1,
                    borderRadius: 9999,
                  }}
                />
              </Pressable>
            </View>

            <View
              style={{
                marginVertical: 10,
                minHeight: 120,
                justifyContent: "space-between",
                gap: 20,
                borderBottomLeftRadius: 32,
                borderTopRightRadius: 32,
                backgroundColor: "#7F9F8A",
                padding: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "sans-semibold",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Monthly Balance
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ gap: 6 }}>
                  {monthlyTotalRows.length > 0 ? (
                    monthlyTotalRows.map(([itemCurrency, amount]) => (
                      <Text
                        key={itemCurrency}
                        style={{
                          fontSize: 24,
                          fontFamily: "sans-extrabold",
                          color: "#ffffff",
                        }}
                      >
                        {formatCurrency(amount, itemCurrency)}
                      </Text>
                    ))
                  ) : (
                    <Text
                      style={{
                        fontSize: 24,
                        fontFamily: "sans-extrabold",
                        color: "#ffffff",
                      }}
                    >
                      {formatCurrency(0, "USD")}
                    </Text>
                  )}
                </View>

                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "sans-medium",
                    color: "#ffffff",
                    opacity: 0.9,
                  }}
                >
                  monthly
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <ListHeading
                title="Upcoming"
                actionLabel="View All"
                onActionPress={() => router.push({
                  pathname: "/subscriptions",
                  params: { filter: "upcoming" }
                })}
              />

              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      paddingVertical: 16,
                      fontSize: 14,
                      fontFamily: "sans-medium",
                      color: "rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    {isLoadingSubscriptions
                      ? "Loading subscriptions..."
                      : subscriptionsError
                        ? subscriptionsError
                        : "No subscriptions yet."}
                  </Text>
                )}
              />
            </View>

            <ListHeading
              title="All Subscriptions"
              actionLabel="View All"
              onActionPress={() => router.push("/subscriptions")}
            />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id
              )
            }
            onEditPress={() => handleEditSubscription(item)}
            onDeletePress={() => handleDeleteSubscription(item)}
            onStatusPress={() => handleToggleStatus(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text
            style={{
              paddingVertical: 16,
              fontSize: 14,
              fontFamily: "sans-medium",
              color: "rgba(0, 0, 0, 0.6)",
            }}
          >
            {isLoadingSubscriptions
              ? "Loading subscriptions..."
              : subscriptionsError
                ? subscriptionsError
                : "No subscriptions yet."}
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <CreateSubscriptionModal
        visible={createModalVisible}
        onClose={handleCloseModal}
        onCreate={handleCreateSubscription}
        onUpdate={handleUpdateSubscription}
        mode={editingSubscription ? "edit" : "create"}
        initialSubscription={editingSubscription}
      />
    </SafeAreaView>
  );
}