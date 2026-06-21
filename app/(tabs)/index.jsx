import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          width: "100%",
          maxWidth: 360,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#0f172a" }}>
          Welcome to MyApp
        </Text>

        <Text style={{ fontSize: 16, color: "#475569", marginTop: 12 }}>
          Expo Router is working.
        </Text>

        <Link href="/onboarding" asChild>
          <Pressable
            style={{
              marginTop: 24,
              backgroundColor: "#2563eb",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
              Go to onboarding
            </Text>
          </Pressable>
        </Link>
        <Link href="/signIn" asChild>
          <Pressable
            style={{
              marginTop: 24,
              backgroundColor: "#2563eb",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
              Sing In
            </Text>
          </Pressable>
        </Link>
        <Link href="/signUp" asChild>
          <Pressable
            style={{
              marginTop: 24,
              backgroundColor: "#2563eb",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
              Sign Up
            </Text>
          </Pressable>
        </Link>
        <Link href="/subscriptions/spotify">Spotify Subscription</Link>
        <Link href={{
          pathname: "/subscriptions/claude",
          params: { id: "claude" },
        }}>
          Claude Max Subscription
        </Link>
        <Link href="/subscriptions/test">
          Test Subscription
        </Link>
      </View>
    </SafeAreaView>
  );
}