import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function SignIn() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [pendingClientTrust, setPendingClientTrust] = useState(false);

  const emailIsValid = /^\S+@\S+\.\S+$/.test(emailAddress.trim());
  const formIsValid = emailIsValid && password.length > 0;

  const handleSignIn = async () => {
    if (!signIn || !formIsValid || isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Sign in state:", {
        status: signIn.status,
        createdSessionId: signIn.createdSessionId,
      });

      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({
          session: signIn.createdSessionId,
        });

        router.replace("/(tabs)");
        return;
      }

      if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
        const { error } = await signIn.emailCode.sendCode();

        if (error) {
          throw error;
        }

        setPendingClientTrust(true);
        setErrorMessage("Enter the verification code sent to your email.");
        return;
      }

      setErrorMessage(
        `Please complete the remaining sign in steps. Status: ${signIn.status || "unknown"}`
      );
    } catch (error) {
      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "Please check your details and try again.";

      console.log("Sign in error:", error);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!signIn || !code.trim() || isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { error } = await signIn.emailCode.verifyCode({
        code: code.trim(),
      });

      if (error) {
        throw error;
      }

      console.log("Client trust verification state:", {
        status: signIn.status,
        createdSessionId: signIn.createdSessionId,
      });

      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({
          session: signIn.createdSessionId,
        });

        router.replace("/(tabs)");
        return;
      }

      setErrorMessage(
        `Verification needs another step. Status: ${signIn.status || "unknown"}`
      );
    } catch (error) {
      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "We could not verify your code.";

      console.log("Client trust verification error:", error);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      style={{
        flex: 1,
        backgroundColor: "#fff9e3",
      }}
    >
      <StatusBar style="dark" backgroundColor="#fff9e3" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 96,
          paddingBottom: 48,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 88,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 6,
                backgroundColor: "#ea7a53",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Text
                style={{
                  color: "#fff9e3",
                  fontSize: 38,
                  fontFamily: "sans-extrabold",
                }}
              >
                S
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: 34,
                  fontFamily: "sans-extrabold",
                  color: "#081126",
                }}
              >
                Subshelf
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 16,
                  fontFamily: "sans-semibold",
                  color: "rgba(8, 17, 38, 0.65)",
                  letterSpacing: 0,
                }}
              >
                SMART SUBSCRIPTIONS
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            textAlign: "center",
            fontSize: 32,
            fontFamily: "sans-extrabold",
            color: "#081126",
            marginBottom: 12,
          }}
        >
          Welcome back
        </Text>

        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontFamily: "sans-medium",
            color: "rgba(8, 17, 38, 0.7)",
            marginBottom: 42,
            lineHeight: 26,
          }}
        >
          Sign in to continue managing your subscriptions
        </Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: "rgba(8, 17, 38, 0.12)",
            borderRadius: 24,
            padding: 24,
            backgroundColor: "rgba(255, 248, 231, 0.55)",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "sans-bold",
              color: "#081126",
              marginBottom: 12,
            }}
          >
            Email
          </Text>

          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="Enter your email"
            placeholderTextColor="rgba(8, 17, 38, 0.55)"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            style={{
              borderWidth: 1,
              borderColor: "rgba(8, 17, 38, 0.22)",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 16,
              fontSize: 18,
              fontFamily: "sans-semibold",
              color: "#081126",
              marginBottom: 28,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              fontFamily: "sans-bold",
              color: "#081126",
              marginBottom: 12,
            }}
          >
            Password
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="rgba(8, 17, 38, 0.55)"
            secureTextEntry
            textContentType="password"
            style={{
              borderWidth: 1,
              borderColor: "rgba(8, 17, 38, 0.22)",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingVertical: 16,
              fontSize: 18,
              fontFamily: "sans-semibold",
              color: "#081126",
            }}
          />

          {!!errorMessage && (
            <Text
              style={{
                marginTop: 14,
                color: "#dc2626",
                fontSize: 14,
                fontFamily: "sans-semibold",
                lineHeight: 20,
              }}
            >
              {errorMessage}
            </Text>
          )}

          {pendingClientTrust && (
            <>
              <Text
                style={{
                  marginTop: 24,
                  fontSize: 18,
                  fontFamily: "sans-bold",
                  color: "#081126",
                  marginBottom: 12,
                }}
              >
                Verification code
              </Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Enter your code"
                placeholderTextColor="rgba(8, 17, 38, 0.55)"
                keyboardType="number-pad"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(8, 17, 38, 0.22)",
                  borderRadius: 18,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  fontSize: 18,
                  fontFamily: "sans-semibold",
                  color: "#081126",
                }}
              />
            </>
          )}

          <Pressable
            onPress={pendingClientTrust ? handleVerifyCode : handleSignIn}
            disabled={!signIn || isSubmitting || (!pendingClientTrust && !formIsValid) || (pendingClientTrust && code.trim().length < 4)}
            style={({ pressed }) => [
              {
                marginTop: 32,
                backgroundColor: "#ea7a53",
                paddingVertical: 18,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 58,
              },
              (!signIn || !formIsValid || isSubmitting) && {
                opacity: 0.55,
              },
              pressed && {
                opacity: 0.85,
              },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 18,
                  fontFamily: "sans-bold",
                }}
              >
                {pendingClientTrust ? "Verify code" : "Sign in"}
              </Text>
            )}
          </Pressable>

          <View
            style={{
              marginTop: 28,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text
              style={{
                color: "rgba(8, 17, 38, 0.7)",
                fontSize: 16,
                fontFamily: "sans-medium",
              }}
            >
              New to Subshelf?
            </Text>

            <Pressable onPress={() => router.push("/(auth)/signUp")}>
              <Text
                style={{
                  color: "#ea7a53",
                  fontSize: 16,
                  fontFamily: "sans-bold",
                }}
              >
                Create an account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}