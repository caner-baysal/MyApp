import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../constants/theme";

export default function TermsOfService() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 80,
                }}
            >
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        borderWidth: 1,
                        borderColor: colors.border,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontFamily: "sans-bold",
                            color: colors.primary,
                        }}
                    >
                        ‹
                    </Text>
                </Pressable>

                <Text
                    style={{
                        fontSize: 30,
                        fontFamily: "sans-extrabold",
                        color: colors.primary,
                        marginBottom: 8,
                    }}
                >
                    Terms of Service
                </Text>

                <Text
                    style={{
                        fontSize: 14,
                        fontFamily: "sans-medium",
                        color: colors.mutedForeground,
                        marginBottom: 24,
                    }}
                >
                    Last updated: June 26, 2026
                </Text>

                <TermsSection title="Use of Subshelf">
                    Subshelf is designed to help users manually track subscriptions,
                    renewal dates, billing frequency, and related subscription details.
                    You are responsible for the information you enter into the app.
                </TermsSection>

                <TermsSection title="Account">
                    Some features may require an account. You are responsible for keeping
                    your account access secure and for activity that occurs through your
                    account.
                </TermsSection>

                <TermsSection title="User-Entered Information">
                    Subscription data, payment method labels, categories, prices, and
                    renewal dates are entered manually by users. Subshelf does not verify
                    this information with subscription providers.
                </TermsSection>

                <TermsSection title="No Financial Advice">
                    Subshelf is an organizational tool and does not provide financial,
                    legal, tax, or investment advice. Any totals, charts, insights, or
                    reminders should be treated as informational estimates.
                </TermsSection>

                <TermsSection title="Acceptable Use">
                    You agree not to misuse the app, interfere with its operation, attempt
                    unauthorized access, or use it for unlawful purposes.
                </TermsSection>

                <TermsSection title="Availability and Changes">
                    Features may change over time. The app may be unavailable at times due
                    to maintenance, updates, technical issues, or third-party service
                    interruptions.
                </TermsSection>

                <TermsSection title="Limitation of Responsibility">
                    To the extent permitted by applicable law, Subshelf is not responsible
                    for losses or issues caused by inaccurate user-entered data, missed
                    renewals, service interruptions, or reliance on app estimates.
                </TermsSection>

                <TermsSection title="Updates to These Terms">
                    These Terms may be updated as the app changes. The date above will be
                    updated when meaningful changes are made.
                </TermsSection>

                <TermsSection title="Contact">
                    Contact information will be provided before public release.
                </TermsSection>
            </ScrollView>
        </SafeAreaView>
    );
}

function TermsSection({ title, children }) {
    return (
        <View style={{ marginBottom: 22 }}>
            <Text
                style={{
                    fontSize: 20,
                    fontFamily: "sans-bold",
                    color: colors.primary,
                    marginBottom: 8,
                }}
            >
                {title}
            </Text>

            <Text
                style={{
                    fontSize: 15,
                    lineHeight: 23,
                    fontFamily: "sans-medium",
                    color: colors.mutedForeground,
                }}
            >
                {children}
            </Text>
        </View>
    );
}