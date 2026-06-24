import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { Text, View, Pressable, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import images from "../../constants/images";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "../../constants/data";
import { icons } from "../../constants/icons";
import { formatCurrency } from "../../constants/utils";
import dayjs from "dayjs";
import ListHeading from "../../components/ListHeading";
import UpcomingSubscriptionCard from "../../components/UpcomingSubscriptionCard";
import SubscriptionCard from "../../components/SubscriptionCard";
import { useState } from "react";

export default function Home() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState(null);
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
              <View style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Image source={images.avatar} style={{ width: 64, height: 64, borderRadius: 9999 }} />
                <Text style={{ marginLeft: 16, fontSize: 24, fontFamily: "sans-bold", color: colors.primary, }}>{HOME_USER.name}</Text>
              </View>
              <Image source={icons.add} style={{ width: 36, height: 36, borderWidth: 1, borderRadius: 9999 }} />
            </View>
            <View style={{
              marginVertical: 10, minHeight: 120, justifyContent: "space-between", gap: 20, borderBottomLeftRadius: 32,
              borderTopRightRadius: 32, backgroundColor: colors.accent, padding: 24
            }}>
              <Text style={{ fontSize: 20, fontFamily: "sans-semibold", color: "rgba(255, 255, 255, 0.8)" }}>Balance</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 26, fontFamily: "sans-extrabold", color: "#ffffff" }}>{formatCurrency(HOME_BALANCE.amount)}</Text>
                <Text style={{ fontSize: 20, fontFamily: "sans-medium", color: "#ffffff" }}>{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}</Text>
              </View>
            </View>
            <View style={{marginBottom: 20}}>
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => <Text style={{
                  paddingVertical: 16,
                  fontSize: 14,
                  fontFamily: "sans-medium",
                  color: "rgba(0, 0, 0, 0.6)",
                }}>No upcoming renewals yet.</Text>}
              />
            </View>
            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id} renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Text style={{
          paddingVertical: 16,
          fontSize: 14,
          fontFamily: "sans-medium",
          color: "rgba(0, 0, 0, 0.6)",
        }}>No subscriptions yet.</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

    </SafeAreaView>
  );
}