import { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { icons } from "../constants/icons";
import {
    formatCurrency,
    formatSubscriptionDateTime,
    formatStatusLabel,
} from "../constants/utils";
import { colors } from "../constants/theme";

export default function SubscriptionCard({
    name,
    price,
    currency,
    icon,
    billing,
    color,
    category,
    plan,
    renewalDate,
    expanded,
    onPress,
    paymentMethod,
    startDate,
    status,
    onEditPress,
    onDeletePress,
    onStatusPress,
    iconUrl,
}) {
    const [iconFailed, setIconFailed] = useState(false);
    const iconSource = iconFailed ? icons.wallet : iconUrl ? { uri: iconUrl } : icon;
    const isActive = !status || status === "active";

    const details = [
        paymentMethod?.trim() ? ["Payment:", paymentMethod.trim()] : null,
        ["Category:", category?.trim() || plan?.trim() || "N/A"],
        ["Started:", startDate ? formatSubscriptionDateTime(startDate) : "N/A"],
        ["Renewal Date:", renewalDate ? formatSubscriptionDateTime(renewalDate) : "N/A"],
        ["Status:", status ? formatStatusLabel(status) : "N/A"],
    ].filter(Boolean);

    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 16,
                },
                {
                    backgroundColor: expanded ? colors.subscription : colors.subscriptionCard,
                },
            ]}
        >
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
                <View style={{ minWidth: 0, flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Image
                        source={iconSource}
                        onError={() => setIconFailed(true)}
                        style={{ width: 32, height: 32, borderRadius: 8 }}
                    />

                    <View style={{ minWidth: 0, flex: 1 }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                marginBottom: 4,
                                fontSize: 18,
                                fontFamily: "sans-bold",
                                color: "#081126",
                            }}
                        >
                            {name}
                        </Text>

                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                fontSize: 14,
                                fontFamily: "sans-semibold",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
                        </Text>
                    </View>
                </View>

                <View style={{ marginLeft: 12, flexShrink: 0, alignItems: "flex-end" }}>
                    <Text
                        style={{
                            marginBottom: 4,
                            fontSize: 18,
                            fontFamily: "sans-bold",
                            color: "#081126",
                        }}
                    >
                        {formatCurrency(price, currency || "USD")}
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            fontFamily: "sans-medium",
                            color: "rgba(0, 0, 0, 0.6)",
                        }}
                    >
                        {billing}
                    </Text>
                </View>
            </View>

            {expanded && (
                <View style={{ marginTop: 24, gap: 24 }}>
                    {details.map(([label, value]) => (
                        <View key={label} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text
                                style={{
                                    flexShrink: 0,
                                    fontSize: 16,
                                    fontFamily: "sans-medium",
                                    color: "rgba(0, 0, 0, 0.6)",
                                }}
                            >
                                {label}
                            </Text>

                            <Text
                                style={{
                                    flex: 1,
                                    fontFamily: "sans-bold",
                                    color: "#081126",
                                }}
                                numberOfLines={1}
                            >
                                {value}
                            </Text>
                        </View>
                    ))}

                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            paddingTop: 4,
                        }}
                    >
                        <Pressable
                            onPress={onEditPress}
                            style={{
                                flex: 1,
                                borderRadius: 9999,
                                paddingVertical: 11,
                                alignItems: "center",
                                backgroundColor: "#081126",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#ffffff",
                                    fontFamily: "sans-bold",
                                    fontSize: 14,
                                }}
                            >
                                Edit
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={onStatusPress}
                            style={{
                                flex: 1,
                                borderRadius: 9999,
                                paddingVertical: 11,
                                alignItems: "center",
                                backgroundColor: "#fff8e7",
                                borderWidth: 1,
                                borderColor: "rgba(0, 0, 0, 0.12)",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#081126",
                                    fontFamily: "sans-bold",
                                    fontSize: 14,
                                }}
                            >
                                {isActive ? "Pause" : "Reactivate"}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={onDeletePress}
                            style={{
                                flex: 1,
                                borderRadius: 9999,
                                paddingVertical: 11,
                                alignItems: "center",
                                backgroundColor: "#dc2626",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#ffffff",
                                    fontFamily: "sans-bold",
                                    fontSize: 14,
                                }}
                            >
                                Delete
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </Pressable>
    );
}