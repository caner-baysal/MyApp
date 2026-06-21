import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signUp = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", color: "#0f172a" }}>
      <Text>Sign Up</Text>
      <Link href="/(auth)/signIn" asChild>
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
            Sign In
          </Text>
        </Pressable>
      </Link>
    </View>
  )
}

export default signUp