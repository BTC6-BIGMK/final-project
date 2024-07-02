import React from "react";
import { View, Image, Text, Dimensions, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import MapView, { Marker } from "react-native-maps";
import { useAR } from "@/hooks/useAR";

const THRESHOLD_DISTANCE = 1000; // メートル単位
const CAMERA_FOV = 60; // カメラの視野角（度）
const BEARING_THRESHOLD = 20; // 方位角の許容誤差（度）
const TARGET_LOCATION = {
  latitude: 35.1193147320576,
  longitude: 137.0384692843589,
};

export default function NativeWindAROverlay() {
  const { hasPermission, showOverlay } = useAR(
    THRESHOLD_DISTANCE,
    TARGET_LOCATION
  );

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Requesting permissions...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No access to camera or location</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      <View className="flex-1">
        <CameraView className="flex-1">
          {showOverlay && (
            <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center	">
              <Image
                source={require("@/assets/images/arimatsu.jpeg")}
                className="w-[80%] object-contain"
              />
            </View>
          )}
        </CameraView>
      </View>
    </View>
  );
}
