import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as Location from "expo-location";
import { DeviceMotion } from "expo-sensors";
import MapView, { Marker } from "react-native-maps";

const THRESHOLD_DISTANCE = 1000; // メートル単位
const CAMERA_FOV = 60; // カメラの視野角（度）
const BEARING_THRESHOLD = 20; // 方位角の許容誤差（度）
const TARGET_LOCATION = {
  latitude: 35.1193147320576,
  longitude: 137.0384692843589,
};

const { width, height } = Dimensions.get("window");

export default function DebugEnhancedAROverlay() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [heading, setHeading] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [bearingToTarget, setBearingToTarget] = useState<number | null>(null);
  const [bearingDifference, setBearingDifference] = useState<number | null>(
    null
  );

  const updateOverlayVisibility = useCallback(
    (loc: Location.LocationObject | null, hdg: number | null) => {
      if (loc && hdg !== null && bearingToTarget !== null) {
        const isInDistance =
          distance !== null && distance <= THRESHOLD_DISTANCE;
        const diff = calculateBearingDifference(hdg, bearingToTarget);
        setBearingDifference(diff);
        const isInView = diff <= CAMERA_FOV / 2 + BEARING_THRESHOLD;
        setShowOverlay(isInDistance && isInView);
      } else {
        setShowOverlay(false);
      }
    },
    [distance, bearingToTarget]
  );

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      setHasPermission(
        cameraStatus === "granted" && locationStatus === "granted"
      );

      if (locationStatus === "granted") {
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          updateLocationAndOverlay
        );

        DeviceMotion.setUpdateInterval(100);
        DeviceMotion.addListener((motion) => {
          if (motion.rotation) {
            const newHeading = getHeadingFromRotation(motion.rotation);
            setHeading(newHeading);
            updateOverlayVisibility(location, newHeading);
          }
        });
      }
    })();

    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, [updateOverlayVisibility]);

  const updateLocationAndOverlay = useCallback(
    (newLocation: Location.LocationObject) => {
      setLocation(newLocation);
      const calculatedDistance = calculateDistance(
        newLocation.coords.latitude,
        newLocation.coords.longitude,
        TARGET_LOCATION.latitude,
        TARGET_LOCATION.longitude
      );
      setDistance(calculatedDistance);
      const bearing = calculateBearing(
        newLocation.coords.latitude,
        newLocation.coords.longitude,
        TARGET_LOCATION.latitude,
        TARGET_LOCATION.longitude
      );
      console.log("Calculated bearing:", bearing);
      setBearingToTarget(bearing);
      updateOverlayVisibility(newLocation, heading);
    },
    [heading, updateOverlayVisibility]
  );

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateBearing = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const λ1 = (lon1 * Math.PI) / 180;
    const λ2 = (lon2 * Math.PI) / 180;

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    const θ = Math.atan2(y, x);
    const bearing = (θ * 180) / Math.PI + 360;
    return bearing % 360;
  };

  const calculateBearingDifference = (heading: number, bearing: number) => {
    let diff = Math.abs(heading - bearing);
    return diff > 180 ? 360 - diff : diff;
  };

  const getHeadingFromRotation = (rotation: any) => {
    const { alpha, beta, gamma } = rotation;

    // デバイスが垂直（portrait）の場合
    if (Math.abs(beta) < Math.PI / 4) {
      return (alpha * 180) / Math.PI;
    }

    // デバイスが水平（landscape）の場合
    let heading = (Math.atan2(-gamma, beta) * 180) / Math.PI + 90;
    if (heading < 0) {
      heading += 360;
    }
    return heading;
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera or location</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera}>
          {showOverlay && (
            <Image
              source={require("@/assets/images/arimatsu.jpeg")}
              style={styles.overlay}
            />
          )}
        </CameraView>
      </View>
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            showsUserLocation={true}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
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
        <Text>
          表示条件:{" "}
          {distance !== null && distance <= THRESHOLD_DISTANCE
            ? "距離OK"
            : "距離NG"}
          ,{" "}
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
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 100,
    height: 100,
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  debugContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
