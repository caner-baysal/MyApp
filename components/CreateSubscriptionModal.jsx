import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import dayjs from "dayjs";
import { colors } from "../constants/theme";


const frequencies = ["Monthly", "Yearly"];

const currencies = ["USD", "EUR", "TRY", "GBP", "CAD", "AUD"];

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

const getSubscriptionIconUrl = (subscriptionName) => {
    const brandKey = normalizeBrandKey(subscriptionName);

    if (!brandKey) {
        return "";
    }

    const domain = brandDomainOverrides[brandKey] || `${brandKey}.com`;

    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

const formatDateInput = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 4) {
        return digits;
    }

    if (digits.length <= 6) {
        return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }

    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
};

const getDefaultRenewalDate = (dateValue, frequency) => {
    const parsedDate = dayjs(dateValue);

    if (!parsedDate.isValid()) {
        return "";
    }

    const nextDate =
        frequency === "Monthly"
            ? parsedDate.add(1, "month")
            : parsedDate.add(1, "year");

    return nextDate.format("YYYY-MM-DD");
};

export default function CreateSubscriptionModal({
    visible,
    onClose,
    onCreate,
    onUpdate,
    mode = "create",
    initialSubscription = null,
}) {
    const isEditMode = mode === "edit";

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState("Monthly");
    const [category, setCategory] = useState("Entertainment");
    const [currency, setCurrency] = useState("USD");
    const [startDate, setStartDate] = useState("");
    const [renewalDate, setRenewalDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const resetForm = () => {
        const today = dayjs();
        const defaultRenewalDate = today.add(1, "month");

        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory("Entertainment");
        setCurrency("USD");
        setStartDate(today.format("YYYY-MM-DD"));
        setRenewalDate(defaultRenewalDate.format("YYYY-MM-DD"));
        setPaymentMethod("");
    };

    useEffect(() => {
        if (!visible) return;

        if (isEditMode && initialSubscription) {
            setName(initialSubscription.name || "");
            setPrice(String(initialSubscription.price || ""));
            setFrequency(initialSubscription.billing || "Monthly");
            setCategory(initialSubscription.category || "Entertainment");
            setCurrency(initialSubscription.currency || "USD");
            setStartDate(
                initialSubscription.startDate
                    ? dayjs(initialSubscription.startDate).format("YYYY-MM-DD")
                    : dayjs().format("YYYY-MM-DD")
            );
            setPaymentMethod(initialSubscription.paymentMethod || "");

            setRenewalDate(
                initialSubscription.renewalDate
                    ? dayjs(initialSubscription.renewalDate).format("YYYY-MM-DD")
                    : dayjs().add(1, "month").format("YYYY-MM-DD")
            );
            return;
        }

        resetForm();
    }, [visible, isEditMode, initialSubscription]);

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleFrequencyChange = (nextFrequency) => {
        setFrequency(nextFrequency);

        const defaultRenewalDate = getDefaultRenewalDate(startDate, nextFrequency);

        if (defaultRenewalDate) {
            setRenewalDate(defaultRenewalDate);
        }
    };

    const handleStartDateChange = (value) => {
        const formattedDate = formatDateInput(value);
        setStartDate(formattedDate);

        const defaultRenewalDate = getDefaultRenewalDate(formattedDate, frequency);

        if (defaultRenewalDate) {
            setRenewalDate(defaultRenewalDate);
        }
    };

    const handleRenewalDateChange = (value) => {
        setRenewalDate(formatDateInput(value));
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

        const parsedStartDate = dayjs(startDate);
        const parsedRenewalDate = dayjs(renewalDate);

        if (!parsedStartDate.isValid()) {
            Alert.alert("Invalid start date", "Please enter start date as YYYY-MM-DD.");
            return;
        }

        if (!parsedRenewalDate.isValid()) {
            Alert.alert("Invalid renewal date", "Please enter renewal date as YYYY-MM-DD.");
            return;
        }

        if (isEditMode && initialSubscription) {
            onUpdate(initialSubscription.id, {
                name: trimmedName,
                price: numericPrice,
                currency,
                billing: frequency,
                category,
                status: initialSubscription.status || "active",
                startDate: parsedStartDate.toISOString(),
                renewalDate: parsedRenewalDate.toISOString(),
                color: categoryColors[category] || categoryColors.Other,
                iconUrl: getSubscriptionIconUrl(trimmedName),
                paymentMethod: paymentMethod.trim(),
            });

            handleClose();
            return;
        }

        const newSubscription = {
            name: trimmedName,
            price: numericPrice,
            currency,
            billing: frequency,
            category,
            paymentMethod: paymentMethod.trim(),
            status: "active",
            startDate: parsedStartDate.toISOString(),
            renewalDate: parsedRenewalDate.toISOString(),
            color: categoryColors[category] || categoryColors.Other,
            iconUrl: getSubscriptionIconUrl(trimmedName),
        };

        onCreate(newSubscription);
        handleClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
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
                            maxHeight: "88%",
                            backgroundColor: colors.background,
                            borderTopLeftRadius: 28,
                            borderTopRightRadius: 28,
                        }}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
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
                                    {isEditMode ? "Edit Subscription" : "New Subscription"}
                                </Text>

                                <Pressable
                                    onPress={handleClose}
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
                                Currency
                            </Text>

                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                                {currencies.map((item) => {
                                    const active = currency === item;

                                    return (
                                        <Pressable
                                            key={item}
                                            onPress={() => setCurrency(item)}
                                            style={{
                                                paddingVertical: 10,
                                                paddingHorizontal: 14,
                                                borderRadius: 9999,
                                                backgroundColor: active ? colors.primary : colors.card,
                                                borderWidth: 1,
                                                borderColor: active ? colors.primary : colors.border,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: active ? "#ffffff" : colors.primary,
                                                    fontSize: 13,
                                                    fontFamily: "sans-bold",
                                                }}
                                            >
                                                {item}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <Text style={{ fontFamily: "sans-bold", color: colors.primary, marginBottom: 8 }}>
                                Payment label
                            </Text>

                            <TextInput
                                value={paymentMethod}
                                onChangeText={setPaymentMethod}
                                placeholder="Optional: App Store, Personal card, Visa ending in 1234"
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
                                Start Date
                            </Text>
                            <TextInput
                                value={startDate}
                                onChangeText={handleStartDateChange}
                                placeholder="YYYY-MM-DD"
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
                                keyboardType="number-pad"
                                maxLength={10}
                            />

                            <Text style={{ fontFamily: "sans-bold", color: colors.primary, marginBottom: 8 }}>
                                Renewal Date
                            </Text>
                            <TextInput
                                value={renewalDate}
                                onChangeText={handleRenewalDateChange}
                                placeholder="YYYY-MM-DD"
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
                                keyboardType="number-pad"
                                maxLength={10}
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
                                            onPress={() => handleFrequencyChange(item)}
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
                                    {isEditMode ? "Save changes" : "Create subscription"}
                                </Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}