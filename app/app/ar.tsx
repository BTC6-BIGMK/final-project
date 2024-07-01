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
  const {
    hasPermission,
    showOverlay,
    distance,
    heading,
    bearingToTarget,
    bearingDifference,
    deviceOrientation,
  } = useAR(THRESHOLD_DISTANCE, TARGET_LOCATION);

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
      <View className="flex-1">
        {location && (
          <MapView
            showsUserLocation={true}
            initialRegion={{
              latitude: TARGET_LOCATION.latitude,
              longitude: TARGET_LOCATION.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            className="w-full h-full"
          >
            <Marker
              coordinate={TARGET_LOCATION}
              title="目標地点"
              pinColor="red"
            />
          </MapView>
        )}
      </View>
      <View style={styles.debugContainer}>
        <Text>距離: {distance ? `${distance.toFixed(2)}m` : "計算中..."}</Text>
        <Text>方角: {heading ? `${heading.toFixed(2)}°` : "不明"}</Text>
        <Text>
          目標への方位:{" "}
          {bearingToTarget ? `${bearingToTarget.toFixed(2)}°` : "計算中..."}
        </Text>
        <Text>
          方位差:{" "}
          {bearingDifference !== null
            ? `${bearingDifference.toFixed(2)}°`
            : "計算中..."}
        </Text>
        <Text>デバイスの向き: {deviceOrientation}</Text>
        <Text>
          表示条件:{" "}
          {distance !== null && distance <= THRESHOLD_DISTANCE
            ? "距離OK"
            : "距離NG"}
          ,
          {bearingDifference !== null &&
          bearingDifference <= CAMERA_FOV / 2 + BEARING_THRESHOLD
            ? "方位OK"
            : "方位NG"}
        </Text>
        <Text>表示: {showOverlay ? "表示中" : "非表示"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  debugContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
