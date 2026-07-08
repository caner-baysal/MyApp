import { useSignUp } from "@clerk/expo";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignUp() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailIsValid = /^\S+@\S+\.\S+$/.test(emailAddress.trim());
  const passwordIsValid = password.length >= 8;
  const codeIsValid = code.trim().length >= 4;

  const handleCreateAccount = async () => {
    if (!signUp || isSubmitting) return;

    setErrorMessage("");

    const emailIsValid = emailAddress.trim().includes("@");
    const passwordIsValid = password.length >= 8;

    if (!emailIsValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!passwordIsValid) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (error) {
      console.log("Sign up error message:", error?.message);
      console.log("Sign up error errors:", error?.errors);

      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "We could not create your account. Please try again.";

      Alert.alert("Sign up error", message);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!signUp || isSubmitting) return;

    setErrorMessage("");

    if (!code.trim()) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (error) {
        throw error;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }

            router.replace("/");
          },
        });
      } else {
        console.log("Sign-up attempt not complete:", signUp);
        setErrorMessage("Verification is not complete yet. Please try again.");
      }
    } catch (error) {
      console.log("Raw verification error:", error);
      console.log("Verification error message:", error?.message);
      console.log("Verification error errors:", error?.errors);

      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "We could not verify your code.";

      Alert.alert("Verification error", message);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp || isSubmitting) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signUp.verifications.sendEmailCode();
    } catch (error) {
      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "We could not send a new code.";

      console.log("Resend code error:", error);
      Alert.alert("Resend code error", message);
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
          paddingTop: 86,
          paddingBottom: 48,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 54,
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
          {pendingVerification ? "Check your email" : "Create account"}
        </Text>

        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontFamily: "sans-medium",
            color: "rgba(8, 17, 38, 0.7)",
            marginBottom: 34,
            lineHeight: 26,
          }}
        >
          {pendingVerification
            ? "Enter the verification code we sent to your inbox"
            : "Start tracking renewals before they surprise you"}
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
          {pendingVerification ? (
            <>
              <Text
                style={{
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

              {!!errorMessage && (
                <Text
                  style={{
                    marginTop: 14,
                    color: errorMessage.includes("Creating")
                      ? "#081126"
                      : "#dc2626",
                    fontSize: 14,
                    fontFamily: "sans-semibold",
                    lineHeight: 20,
                  }}
                >
                  {errorMessage}
                </Text>
              )}

              <Pressable
                onPress={handleVerifyEmail}
                disabled={isSubmitting}
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
                  isSubmitting && {
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
                    Verify email
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleResendCode}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  {
                    marginTop: 18,
                    alignItems: "center",
                  },
                  pressed && {
                    opacity: 0.75,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#081126",
                    fontSize: 16,
                    fontFamily: "sans-bold",
                  }}
                >
                  Send a new code
                </Text>
              </Pressable>
            </>
          ) : (
            <>
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
                  marginBottom: 24,
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
                placeholder="At least 8 characters"
                placeholderTextColor="rgba(8, 17, 38, 0.55)"
                secureTextEntry
                textContentType="newPassword"
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
                    color: errorMessage.includes("Creating")
                      ? "#081126"
                      : "#dc2626",
                    fontSize: 14,
                    fontFamily: "sans-semibold",
                    lineHeight: 20,
                  }}
                >
                  {errorMessage}
                </Text>
              )}
              <Pressable
                onPress={handleCreateAccount}
                disabled={isSubmitting}
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
                  isSubmitting && {
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
                    Create account
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
                  Already have an account?
                </Text>

                <Pressable onPress={() => router.push("/(auth)/signIn")}>
                  <Text
                    style={{
                      color: "#ea7a53",
                      fontSize: 16,
                      fontFamily: "sans-bold",
                    }}
                  >
                    Sign in
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}