import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubscriptionCard from "../../../components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "../../../constants/data";
import { colors } from "../../../constants/theme";

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState(null);

  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return HOME_SUBSCRIPTIONS;
    }

    return HOME_SUBSCRIPTIONS.filter((subscription) => {
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
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setExpandedSubscriptionId(null);
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
        <Text
          style={{
            fontSize: 30,
            fontFamily: "sans-extrabold",
            color: colors.primary,
            marginBottom: 8,
          }}
        >
          Subscriptions
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontFamily: "sans-medium",
            color: colors.mutedForeground,
            lineHeight: 22,
            marginBottom: 18,
          }}
        >
          Search and review every plan you are tracking.
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
    </SafeAreaView>
  );
}