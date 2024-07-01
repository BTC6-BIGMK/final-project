import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { Camera, CameraView } from "expo-camera";
import { DeviceMotion } from "expo-sensors";

const CAMERA_FOV = 60; // カメラの視野角（度）
const BEARING_THRESHOLD = 20; // 方位角の許容誤差（度）

interface Response {
  hasPermission: boolean | null;
  showOverlay: boolean;
  distance: number | null;
  heading: number | null;
  bearingToTarget: number | null;
  bearingDifference: number | null;
  deviceOrientation: string;
  location: Location.LocationObject | null;
}

export const useAR = (
  thresholdDistance: number,
  targetLocation: { latitude: number; longitude: number }
): Response => {
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
  const [deviceOrientation, setDeviceOrientation] = useState<string>("unknown");

  const updateOverlayVisibility = useCallback(
    (loc: Location.LocationObject | null, hdg: number | null) => {
      if (loc && hdg !== null && bearingToTarget !== null) {
        const isInDistance = distance !== null && distance <= thresholdDistance;
        const diff = calculateBearingDifference(hdg, bearingToTarget);
        setBearingDifference(diff);
        const isInView = diff <= CAMERA_FOV / 2 + BEARING_THRESHOLD;
        setShowOverlay(isInDistance && isInView);
      } else {
        setShowOverlay(false);
      }
    },
    [distance, bearingToTarget, deviceOrientation]
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
          const { rotation } = motion;
          if (rotation) {
            const { beta, gamma } = rotation;
            const newOrientation = getDeviceOrientation(beta, gamma);
            setDeviceOrientation(newOrientation);
            const newHeading = getHeadingFromRotation(rotation, newOrientation);
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
        targetLocation.latitude,
        targetLocation.longitude
      );
      setDistance(calculatedDistance);
      const bearing = calculateBearing(
        newLocation.coords.latitude,
        newLocation.coords.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );
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

  const getDeviceOrientation = (beta: number, gamma: number) => {
    if (Math.abs(beta) < 10 && Math.abs(gamma) < 10) {
      return "flat";
    } else if (Math.abs(gamma) < 10) {
      return "portrait";
    } else {
      return "landscape";
    }
  };

  const getHeadingFromRotation = (rotation: any, orientation: string) => {
    const { alpha, beta, gamma } = rotation;

    switch (orientation) {
      case "flat":
        return (alpha * 180) / Math.PI;
      case "portrait":
        return ((Math.atan2(gamma, -beta) * 180) / Math.PI + 360) % 360;
      case "landscape":
        return ((Math.atan2(-beta, gamma) * 180) / Math.PI + 360) % 360;
      default:
        return 0;
    }
  };

  return {
    hasPermission,
    showOverlay,
    distance,
    heading,
    bearingToTarget,
    bearingDifference,
    deviceOrientation,
    location,
  };
};
