import { Text, View } from "react-native";

export default function Onboarding() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Onboarding</Text>
    </View>
  );
}