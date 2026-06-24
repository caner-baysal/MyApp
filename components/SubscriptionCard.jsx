import { View, Text, Image, Pressable } from "react-native";
import { formatCurrency, formatSubscriptionDateTime, formatStatusLabel } from "../constants/utils";

export default function SubscriptionCard({ name, price, currency, icon, billing, color, category, plan,
    renewalDate, expanded, onPress, paymentMethod, startDate, status }) {
    return (
        <Pressable onPress={onPress} style={[
            {
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.1)",
                padding: 16,
            },
            {
                backgroundColor: expanded ? "#8fd1bd" : "#fff8e7"
            },
            !expanded && color ? {
                backgroundColor: color
            } : undefined
        ]}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
                <View style={{ minWidth: 0, flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Image source={icon} style={{ width: 64, height: 64, borderRadius: 8, }} />
                    <View style={{ minWidth: 0, flex: 1 }}>
                        <Text numberOfLines={1} style={{ marginBottom: 4, fontSize: 18, fontFamily: "sans-bold", color: "#081126", }}>
                            {name}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, fontFamily: "sans-semibold", color: "rgba(0, 0, 0, 0.6)" }}>
                            {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
                        </Text>
                    </View>
                </View>
                <View style={{ marginLeft: 12, flexShrink: 0, alignItems: "flex-end" }}>
                    <Text style={{ marginBottom: 4, fontSize: 18, fontFamily: "sans-bold", color: "#081126", }}>{formatCurrency(price, currency)}</Text>
                    <Text style={{ fontSize: 14, fontFamily: "sans-medium", color: "rgba(0, 0, 0, 0.6)" }}>{billing}</Text>
                </View>
            </View>
            {expanded && (
                <View style={{ marginTop: 24, gap: 16 }}>
                    <View style={{ gap: 24 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ flexShrink: 0, fontSize: 16, fontFamily: "sans-medium", color: "rgba(0, 0, 0, 0.6)" }}>
                                Payment:
                            </Text>
                            <Text style={{ flex: 1, fontFamily: "sans-bold", color: "#081126" }} numberOfLines={1}>
                                {paymentMethod?.trim() ?? "N/A"}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ flexShrink: 0, fontSize: 16, fontFamily: "sans-medium", color: "rgba(0, 0, 0, 0.6)" }}>
                                Category:
                            </Text>
                            <Text style={{ flex: 1, fontFamily: "sans-bold", color: "#081126" }} numberOfLines={1}>
                                {category?.trim() || plan?.trim() || "N/A"}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ flexShrink: 0, fontSize: 16, fontFamily: "sans-medium", color: "rgba(0, 0, 0, 0.6)" }}>
                                Started:
                            </Text>
                            <Text style={{ flex: 1, fontFamily: "sans-bold", color: "#081126" }} numberOfLines={1}>
                                {startDate ? formatSubscriptionDateTime(startDate) : "N/A"}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ flexShrink: 0, fontSize: 16, fontFamily: "sans-medium", color: "rgba(0, 0, 0, 0.6)" }}>
                                Renewal Date:
                            </Text>
                            <Text style={{ flex: 1, fontFamily: "sans-bold", color: "#081126" }} numberOfLines={1}>
                                {renewalDate ? formatSubscriptionDateTime(renewalDate) : "N/A"}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ flexShrink: 0, fontSize: 16, fontFamily: "sans-medium", color: "rgba(0, 0, 0, 0.6)" }}>
                                Status:
                            </Text>
                            <Text style={{ flex: 1, fontFamily: "sans-bold", color: "#081126" }} numberOfLines={1}>
                                {status ? formatStatusLabel(status) : "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </Pressable>
    );
}