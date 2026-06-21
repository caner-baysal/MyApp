import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const signIn = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", color: "#0f172a" }}>
      <Text>Sign In</Text>
      <Link href="/(auth)/signUp" asChild>
        <Pressable
          style={{
            marginTop: 24,
            backgroundColor: "#2563eb",
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 10,
          }}
        >
          <Text style={{color: "#ffffff", fontSize: 16, fontWeight: "600"}}>
            Create Account
          </Text>
        </Pressable>
      </Link>
    </View>
  )
}

export default signIn