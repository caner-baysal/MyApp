import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";

const settings = () => {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>settings</Text>
    </SafeAreaView>
  )
}

export default settings