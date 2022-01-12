import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { Button, Separator } from "@huds0n/components";

import { Navigator } from "./navigator";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>

      <Separator />

      <Button onPress={() => Navigator.switch({ screen: "SwitchScreen" })}>
        Switch
      </Button>

      <Separator />

      <Button onPress={() => Navigator.navigate({ screen: "NavigateScreen" })}>
        Navigate
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
