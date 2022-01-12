import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { Button, Separator } from "@huds0n/components";

import { Navigator } from "./navigator";

export default function SwitchScreen() {
  return (
    <View style={styles.container}>
      <Text>Switch Screen</Text>

      <Separator />

      <Button onPress={() => Navigator.switch({ screen: "HomeScreen" })}>
        Switch
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
