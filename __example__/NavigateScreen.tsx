import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { Button, Separator } from "@huds0n/components";

import { Navigator } from "./navigator";

export default function NavigateScreen() {
  return (
    <View style={styles.container}>
      <Text>Navigate Screen</Text>

      <Separator />

      <Button onPress={() => Navigator.goBack()}>Go Back</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
