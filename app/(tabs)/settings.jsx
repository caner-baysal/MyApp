import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { colors } from "../../constants/theme";

export default function Settings() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [renewalReminders, setRenewalReminders] = useState(true);

  const displayName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Subshelf User";

  const email = user?.primaryEmailAddress?.emailAddress || "No email connected";

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/signIn");
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontFamily: "sans-extrabold",
            color: colors.primary,
            marginBottom: 20,
          }}
        >
          Settings
        </Text>

        <View
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            padding: 18,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 9999,
                backgroundColor: colors.muted,
              }}
            />
          ) : (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 9999,
                backgroundColor: colors.accent,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 22,
                  fontFamily: "sans-extrabold",
                }}
              >
                {initials}
              </Text>
            </View>
          )}

          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 20,
                fontFamily: "sans-bold",
                color: colors.primary,
              }}
            >
              {displayName}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                marginTop: 4,
                fontSize: 14,
                fontFamily: "sans-medium",
                color: colors.mutedForeground,
              }}
            >
              {email}
            </Text>
          </View>
        </View>

        <SettingsSection title="Notifications">
          <SettingsSwitchRow
            title="Renewal reminders"
            description="Get reminded before subscriptions renew."
            value={renewalReminders}
            onValueChange={setRenewalReminders}
          />
        </SettingsSection>

        <SettingsSection title="Legal">
          <SettingsLinkRow
            title="Privacy Policy"
            onPress={() => router.push("/privacy-policy")}
          />

          <SettingsLinkRow
            title="Terms of Service"
            onPress={() => router.push("/terms-of-service")}
          />
        </SettingsSection>

        <SettingsSection title="App">
          <SettingsInfoRow title="Version" value="1.0.0" />
        </SettingsSection>

        <Pressable
          onPress={handleSignOut}
          style={{
            marginTop: 8,
            borderRadius: 18,
            backgroundColor: colors.primary,
            paddingVertical: 16,
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
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsSection({ title, children }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "sans-bold",
          color: colors.primary,
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          borderRadius: 24,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function SettingsSwitchRow({ title, description, value, onValueChange }) {
  return (
    <View
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "sans-bold",
            color: colors.primary,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            fontFamily: "sans-medium",
            color: colors.mutedForeground,
          }}
        >
          {description}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.muted,
          true: colors.subscription,
        }}
        thumbColor={value ? colors.primary : "#ffffff"}
      />
    </View>
  );
}

function SettingsInfoRow({ title, value }) {
  return (
    <View
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: "sans-bold",
          color: colors.primary,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: 14,
          fontFamily: "sans-semibold",
          color: colors.mutedForeground,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function SettingsLinkRow({ title, value, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: "sans-bold",
          color: colors.primary,
        }}
      >
        {title}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {!!value && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: "sans-semibold",
              color: colors.mutedForeground,
            }}
          >
            {value}
          </Text>
        )}

        <Text
          style={{
            fontSize: 20,
            fontFamily: "sans-bold",
            color: colors.mutedForeground,
          }}
        >
          ›
        </Text>
      </View>
    </Pressable>
  );
}