import { Slot } from "expo-router";
import { ImageBackground } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

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
  const router = useRouter();
  Notifications.addNotificationResponseReceivedListener((e) => {
    console.log("in : ", e.notification.request.content.data);

    router.push({
      pathname: "/spot-map",
      params: {
        id: e.notification.request.content.data.name.split(",")[0],
        name: e.notification.request.content.data.name.split(",")[1],
        lat: e.notification.request.content.data.lat,
        lng: e.notification.request.content.data.lng,
      },
    });
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
