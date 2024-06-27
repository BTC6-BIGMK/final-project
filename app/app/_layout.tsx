import { Slot, Stack } from "expo-router";
import { ImageBackground } from "react-native";

import React from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Notifications from "expo-notifications";

const requestPermissionsAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync();
  if (granted) {
    return;
  }

  await Notifications.requestPermissionsAsync();
};

export default function RootLayout() {
  React.useEffect(() => {
    requestPermissionsAsync();
  });
  return (
    <>
      <ImageBackground
        source={require("@/assets/images/washi.jpeg")}
        className="flex-1 justify-center z-50"
      >
        <Slot />
      </ImageBackground>
    </>
  );
}
