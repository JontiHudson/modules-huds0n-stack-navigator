import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { Stack } from "@huds0n/stack-navigator";

import { Navigator } from "./navigator";

import HomeScreen from "./HomeScreen";
import SwitchScreen from "./SwitchScreen";
import NavigateScreen from "./NavigateScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Stack
        navigator={Navigator}
        screens={{
          HomeScreen: <HomeScreen />,
          SwitchScreen: <SwitchScreen />,
          NavigateScreen: <NavigateScreen />,
        }}
        screenStyle={styles.stackScreen}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stackScreen: {
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.25,
    shadowColor: "grey",
  },
  safeAreaView: { flex: 1 },
});
