import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";

export default function Settings() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Signed in user";

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : null;

  const email = user?.primaryEmailAddress?.emailAddress;
  const avatarUrl = user?.imageUrl;

  const handleSignOut = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log out",
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
        backgroundColor: "#f8fafc",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontFamily: "sans-bold",
          color: colors.primary,
          marginBottom: 24,
        }}
      >
        Settings
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff8e7",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.1)",
          padding: 16,
          marginBottom: 20,
        }}
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
            }}
          />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
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
                fontFamily: "sans-bold",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={{ marginLeft: 14, flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontFamily: "sans-bold",
              color: colors.primary,
            }}
          >
            {displayName}
          </Text>

          {!!email && (
            <Text
              numberOfLines={1}
              style={{
                marginTop: 4,
                fontSize: 14,
                fontFamily: "sans-medium",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              {email}
            </Text>
          )}
          {!!joined && (
            <Text
              numberOfLines={1}
              style={{
                marginTop: 4,
                fontSize: 12,
                fontFamily: "sans-medium",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              Joined {joined}
            </Text>
          )}
        </View>

      </View>

      <Pressable
        onPress={handleSignOut}
        style={{
          backgroundColor: "#081126",
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontFamily: "sans-semibold",
          }}
        >
          Log out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}