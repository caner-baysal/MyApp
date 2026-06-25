import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import dayjs from "dayjs";
import { icons } from "../constants/icons";
import { colors } from "../constants/theme";

const frequencies = ["Monthly", "Yearly"];

const categories = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
];

const categoryColors = {
    Entertainment: "#f5c542",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    Design: "#b8e8d0",
    Productivity: "#f6eecf",
    Cloud: "#c7d2fe",
    Music: "#bbf7d0",
    Other: "#fff8e7",
};

const brandDomainOverrides = {
    youtube: "youtube.com",
    youtubepremium: "youtube.com",
    claude: "claude.ai",
    chatgpt: "openai.com",
    applemusic: "music.apple.com",
    appletv: "tv.apple.com",
    disneyplus: "disneyplus.com",
    googlecloud: "cloud.google.com",
    googledrive: "drive.google.com",
    githubcopilot: "github.com",
    microsoftteams: "microsoft.com",
    onedrive: "onedrive.live.com",
    adobecreativecloud: "adobe.com",
    amazonprime: "primevideo.com",
    primevideo: "primevideo.com",
    hbomax: "max.com",
};

const normalizeBrandKey = (value) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

const getSubscriptionIcon = (subscriptionName) => {
    const brandKey = normalizeBrandKey(subscriptionName);

    if (!brandKey) {
        return icons.wallet;
    }

    const domain = brandDomainOverrides[brandKey] || `${brandKey}.com`;

    return {
        uri: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    };
};

export default function CreateSubscriptionModal({ visible, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState("Monthly");
    const [category, setCategory] = useState("Entertainment");

    const resetForm = () => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory("Entertainment");
    };

    const handleSubmit = () => {
        const trimmedName = name.trim();
        const numericPrice = Number(price.replace(",", "."));

        if (!trimmedName) {
            Alert.alert("Missing name", "Please enter a subscription name.");
            return;
        }

        if (!numericPrice || numericPrice <= 0) {
            Alert.alert("Invalid price", "Please enter a positive price.");
            return;
        }

        const now = dayjs();
        const renewalDate =
            frequency === "Monthly" ? now.add(1, "month") : now.add(1, "year");

        const newSubscription = {
            id: `${normalizeBrandKey(trimmedName)}-${Date.now()}`,
            icon: getSubscriptionIcon(trimmedName),
            name: trimmedName,
            plan: `${frequency} Plan`,
            category,
            paymentMethod: "Not set",
            status: "active",
            startDate: now.toISOString(),
            price: numericPrice,
            currency: "USD",
            billing: frequency,
            renewalDate: renewalDate.toISOString(),
            color: categoryColors[category] || categoryColors.Other,
        };

        onCreate(newSubscription);
        resetForm();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.35)",
                    justifyContent: "flex-end",
                }}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View
                        style={{
                            backgroundColor: colors.background,
                            borderTopLeftRadius: 28,
                            borderTopRightRadius: 28,
                            padding: 24,
                            paddingBottom: 36,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 24,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontFamily: "sans-bold",
                                    color: colors.primary,
                                }}
                            >
                                New Subscription
                            </Text>

                            <Pressable
                                onPress={onClose}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 9999,
                                    backgroundColor: colors.card,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ fontSize: 20, color: colors.primary }}>x</Text>
                            </Pressable>
                        </View>

                        <Text style={{ fontFamily: "sans-bold", color: colors.primary, marginBottom: 8 }}>
                            Name
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Netflix, Spotify, Claude..."
                            placeholderTextColor="rgba(8, 17, 38, 0.45)"
                            style={{
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                fontSize: 16,
                                fontFamily: "sans-semibold",
                                color: colors.primary,
                                backgroundColor: colors.card,
                                marginBottom: 18,
                            }}
                        />

                        <Text style={{ fontFamily: "sans-bold", color: colors.primary, marginBottom: 8 }}>
                            Price
                        </Text>
                        <TextInput
                            value={price}
                            onChangeText={setPrice}
                            placeholder="9.99"
                            placeholderTextColor="rgba(8, 17, 38, 0.45)"
                            keyboardType="decimal-pad"
                            style={{
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                fontSize: 16,
                                fontFamily: "sans-semibold",
                                color: colors.primary,
                                backgroundColor: colors.card,
                                marginBottom: 18,
                            }}
                        />

                        <Text style={{ fontFamily: "sans-bold", color: colors.primary, marginBottom: 10 }}>
                            Frequency
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
                            {frequencies.map((item) => {
                                const active = frequency === item;

                                return (
                                    <Pressable
                                        key={item}
                                        onPress={() => setFrequency(item)}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            borderRadius: 9999,
                                            alignItems: "center",
                                            backgroundColor: active ? colors.primary : colors.card,
                                            borderWidth: 1,
                                            borderColor: active ? colors.primary : colors.border,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: active ? "#ffffff" : colors.primary,
                                                fontFamily: "sans-bold",
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Text style={{ fontFamily: "sans-bold", color: colors.primary, marginBottom: 10 }}>
                            Category
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                            {categories.map((item) => {
                                const active = category === item;

                                return (
                                    <Pressable
                                        key={item}
                                        onPress={() => setCategory(item)}
                                        style={{
                                            paddingVertical: 9,
                                            paddingHorizontal: 12,
                                            borderRadius: 9999,
                                            backgroundColor: active ? colors.accent : colors.card,
                                            borderWidth: 1,
                                            borderColor: active ? colors.accent : colors.border,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: active ? "#ffffff" : colors.primary,
                                                fontSize: 13,
                                                fontFamily: "sans-semibold",
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Pressable
                            onPress={handleSubmit}
                            style={{
                                backgroundColor: colors.accent,
                                borderRadius: 18,
                                paddingVertical: 17,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#ffffff",
                                    fontSize: 17,
                                    fontFamily: "sans-bold",
                                }}
                            >
                                Create subscription
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}