import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubscriptionCard from "../../../components/SubscriptionCard";
import CreateSubscriptionModal from "../../../components/CreateSubscriptionModal";
import { useSubscriptions } from "../../../context/SubscriptionsContext";
import { colors } from "../../../constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import dayjs from "dayjs";

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { filter } = useLocalSearchParams();
  const router = useRouter();
  const isUpcomingFilter = filter === "upcoming";

  const {
    subscriptions,
    updateSubscription,
    deleteSubscription,
    setSubscriptionStatus,
  } = useSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const today = dayjs().startOf("day");

    const baseSubscriptions =
      isUpcomingFilter
        ? subscriptions.filter((subscription) => {
          if (subscription.status && subscription.status !== "active") {
            return false;
          }

          const renewalDate = dayjs(subscription.renewalDate);

          if (!renewalDate.isValid()) {
            return false;
          }

          const daysLeft = renewalDate.startOf("day").diff(today, "day");

          return daysLeft >= 0 && daysLeft <= 30;
        })
        : subscriptions;

    if (!query) {
      return baseSubscriptions;
    }

    return baseSubscriptions.filter((subscription) => {
      const searchableText = [
        subscription.name,
        subscription.plan,
        subscription.category,
        subscription.paymentMethod,
        subscription.status,
        subscription.billing,
        subscription.currency,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery, subscriptions, isUpcomingFilter]);

  const clearSearch = () => {
    setSearchQuery("");
    setExpandedSubscriptionId(null);
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
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
          onPress: () => {
            deleteSubscription(subscription.id);

            if (expandedSubscriptionId === subscription.id) {
              setExpandedSubscriptionId(null);
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = (subscription) => {
    const isActive = !subscription.status || subscription.status === "active";
    setSubscriptionStatus(subscription.id, isActive ? "paused" : "active");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingHorizontal: 20,
        paddingTop: 12,
      }}
    >
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontFamily: "sans-extrabold",
              color: colors.primary,
              flex: 1,
            }}
          >
            {isUpcomingFilter ? "Upcoming Renewals" : "Subscriptions"}
          </Text>

          {isUpcomingFilter && (
            <Pressable
              onPress={() => router.replace("/subscriptions")}
              style={{
                borderRadius: 9999,
                backgroundColor: colors.primary,
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 13,
                  fontFamily: "sans-bold",
                }}
              >
                Show all
              </Text>
            </Pressable>
          )}
        </View>

        <Text
          style={{
            fontSize: 15,
            fontFamily: "sans-medium",
            color: colors.mutedForeground,
            lineHeight: 22,
            marginBottom: 18,
          }}
        >
          {isUpcomingFilter
            ? "Renewals due in the next 30 days."
            : "Search and review every plan you are tracking."}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 18,
            backgroundColor: colors.card,
            paddingHorizontal: 16,
            minHeight: 54,
          }}
        >
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search subscriptions"
            placeholderTextColor="rgba(0, 0, 0, 0.45)"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: "sans-semibold",
              color: colors.primary,
              paddingVertical: 14,
            }}
          />

          {!!searchQuery && (
            <Pressable
              onPress={clearSearch}
              style={{
                marginLeft: 10,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 9999,
                backgroundColor: colors.primary,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 12,
                  fontFamily: "sans-bold",
                }}
              >
                Clear
              </Text>
            </Pressable>
          )}
        </View>

        <Text
          style={{
            marginTop: 14,
            fontSize: 14,
            fontFamily: "sans-medium",
            color: colors.mutedForeground,
          }}
        >
          {filteredSubscriptions.length} subscription
          {filteredSubscriptions.length === 1 ? "" : "s"} found
        </Text>
      </View>

      <FlatList
        data={filteredSubscriptions}
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              paddingVertical: 36,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "sans-bold",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              No subscriptions found
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: "sans-medium",
                color: colors.mutedForeground,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Try searching by name, category, status, or payment method.
            </Text>
          </View>
        )}
      />

      <CreateSubscriptionModal
        visible={editModalVisible}
        onClose={handleCloseEditModal}
        onUpdate={updateSubscription}
        mode="edit"
        initialSubscription={editingSubscription}
      />
    </SafeAreaView>
  );
}