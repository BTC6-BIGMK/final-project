import React, { useEffect, useState, useCallback } from "react";
import { View, Image, Text, Dimensions, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import MapView, { Marker } from "react-native-maps";
import { useAR } from "@/hooks/useAR";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";

const THRESHOLD_DISTANCE = 1000; // メートル単位
const CAMERA_FOV = 60; // カメラの視野角（度）
const BEARING_THRESHOLD = 20; // 方位角の許容誤差（度）
const TARGET_LOCATION = {
  //latitude: 35.1193147320576,
  //longitude: 137.0384692843589,
  latitude: 34.94530800278608,
  longitude: 137.16782906064086,
};
export default function NativeWindAROverlay() {
  const { hasPermission, showOverlay } = useAR(
    THRESHOLD_DISTANCE,
    TARGET_LOCATION
  );

  const { id } = useLocalSearchParams();

  const [arContents, setArContents] = useState<{
    lat: number;
    lng: number;
    image_url: string;
    type: string;
  }>();

  const [trans, setTrans] = useState<number>(0.5);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        //`http://localhost:3000/api/area-spots/${id}/contents`
        `http://192.168.3.3:3000/api/area-spots/${id}/contents`
      );
      setArContents(response.data[0]);
    })();
  }, []);

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

  if (arContents === undefined) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      <View className="flex-1">
        <CameraView className="flex-1">
          {/* showOverlay確認用に ! 追加 */}
          {!showOverlay && (
            <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center	">
              {arContents.type === "trans" ? (
                <>
                  <Image
                    source={{
                      uri: arContents!.image_url,
                    }}
                    className="w-[80%] object-contain"
                    style={{ opacity: trans }}
                  />
                  <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={0.5}
                    onValueChange={(value) => {
                      setTrans(value);
                    }}
                  />
                </>
              ) : (
                <Image
                  source={{
                    uri: arContents!.image_url,
                  }}
                  className="w-[80%] object-contain"
                />
              )}
            </View>
          )}
        </CameraView>
      </View>
    </View>
  );
}
