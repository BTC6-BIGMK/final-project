import { Slot, Stack } from "expo-router";
import { ImageBackground } from "react-native";

import React from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Notifications from "expo-notifications";

const scheduleNotificationAsync = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "test title",
      subtitle: "spot-name",
      body: "test",
      sound: "default",
    },
    trigger: {
      seconds: 10,
    },
  });
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const requestPermissionsAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync();
  if (granted) {
    return;
  }

  await Notifications.requestPermissionsAsync();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
});

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
      <View style={styles.container}>
        <Button
          title="3秒後にプッシュ通知する"
          onPress={scheduleNotificationAsync}
        />
      </View>
    </>
  );
}
