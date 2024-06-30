import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as Location from "expo-location";
import { DeviceMotion } from "expo-sensors";

const THRESHOLD_DISTANCE = 100; // メートル単位
const CAMERA_FOV = 60; // カメラの視野角（度）
const TARGET_LOCATION = {
  latitude: 35.11962307663533,
  longitude: 137.0382500832495,
};

export default function LocationBasedCameraOverlay() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [heading, setHeading] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [bearingToTarget, setBearingToTarget] = useState<number | null>(null);

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
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          updateLocationAndOverlay
        );

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
  }, []);

  const updateLocationAndOverlay = (newLocation: Location.LocationObject) => {
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
    setBearingToTarget(bearing);
    updateOverlayVisibility(newLocation, heading);
  };

  const updateOverlayVisibility = (
    loc: Location.LocationObject | null,
    hdg: number | null
  ) => {
    if (loc && hdg !== null && bearingToTarget !== null) {
      const isInDistance = distance !== null && distance <= THRESHOLD_DISTANCE;
      const bearingDifference = Math.abs(hdg - bearingToTarget);
      const isInView =
        bearingDifference <= CAMERA_FOV / 2 ||
        bearingDifference >= 360 - CAMERA_FOV / 2;
      setShowOverlay(isInDistance && isInView);
    } else {
      setShowOverlay(false);
    }
  };

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

  const getHeadingFromRotation = (rotation: any) => {
    const { alpha, beta, gamma } = rotation;
    let heading = Math.atan2(beta!, alpha!) * (180 / Math.PI);
    if (heading < 0) {
      heading += 360;
    }
    return heading;
  };

  if (hasPermission === null) {
    return <View />;
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
      <CameraView style={styles.camera}>
        {showOverlay && (
          <Image
            source={require("@/assets/images/arimatsu.jpeg")}
            style={styles.overlay}
          />
        )}
      </CameraView>
      <View style={styles.debugContainer}>
        <Text>
          Target Location: {TARGET_LOCATION.latitude.toFixed(4)},{" "}
          {TARGET_LOCATION.longitude.toFixed(4)}
        </Text>
        <Text>
          Current Location:{" "}
          {location
            ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
            : "Unknown"}
        </Text>
        <Text>
          Distance to target:{" "}
          {distance ? `${distance.toFixed(2)} meters` : "Calculating..."}
        </Text>
        <Text>
          Current Heading: {heading ? `${heading.toFixed(2)}°` : "Unknown"}
        </Text>
        <Text>
          Bearing to Target:{" "}
          {bearingToTarget
            ? `${bearingToTarget.toFixed(2)}°`
            : "Calculating..."}
        </Text>
        <Text>Overlay Visible: {showOverlay ? "Yes" : "No"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
