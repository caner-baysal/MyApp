import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../constants/theme";

export default function PrivacyPolicy() {
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
                    Privacy Policy
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

                <PolicySection title="Overview">
                    Subshelf is a subscription tracking app. It helps users manually track
                    subscriptions, prices, renewal dates, billing frequency, and related
                    information.
                </PolicySection>

                <PolicySection title="Information You Provide">
                    You may provide information such as your email address, account
                    details, subscription names, prices, categories, renewal dates,
                    billing frequency, payment method labels, and subscription status.
                </PolicySection>

                <PolicySection title="Authentication">
                    Subshelf uses Clerk for account authentication. Clerk may process
                    information such as your email address, authentication tokens, and
                    session data to provide sign-in, sign-up, verification, and account
                    security features.
                </PolicySection>

                <PolicySection title="How Information Is Used">
                    Information is used to provide app functionality, including account
                    access, subscription tracking, renewal views, insights, and settings.
                    The app is not intended to sell personal information.
                </PolicySection>

                <PolicySection title="Subscription Data">
                    Subscription data is based on information you enter manually. You
                    should avoid entering sensitive payment card numbers, bank account
                    numbers, passwords, or other highly sensitive information into app
                    fields.
                </PolicySection>

                <PolicySection title="Third-Party Services">
                    Subshelf may rely on third-party services for features such as
                    authentication, app hosting, storage, analytics, crash reporting, or
                    similar operational purposes. These services may process data as needed
                    to provide their functionality.
                </PolicySection>

                <PolicySection title="Data Accuracy">
                    Subscription totals, renewal dates, and insights depend on the
                    information entered by the user. The app may display estimates and
                    should not be treated as financial, legal, tax, or investment advice.
                </PolicySection>

                <PolicySection title="Security">
                    Reasonable measures may be used to protect user information. However,
                    no app, network, or storage system can be guaranteed to be completely
                    secure.
                </PolicySection>

                <PolicySection title="Changes to This Policy">
                    This Privacy Policy may be updated as the app changes. The date above
                    will be updated when meaningful changes are made.
                </PolicySection>

                <PolicySection title="Contact">
                    Contact information will be provided before public release.
                </PolicySection>
            </ScrollView>
        </SafeAreaView>
    );
}

function PolicySection({ title, children }) {
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