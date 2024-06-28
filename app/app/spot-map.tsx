import React, { useEffect, useState, useRef, useCallback } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { Dimensions, Text, View, Image, Pressable, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import Animated from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function SpotMapScreen() {
  const { id, name, lat, lng } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  console.log("spot", id, name, lat, lng);

  useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync({});

      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.007;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  const sheetRef = React.useRef<HTMLButtonElement>(null);

  const renderContent = () => (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
        height: 450,
      }}
    >
      <Text>Swipe down to close</Text>
    </View>
    //     <View
    //       style={{
    //         backgroundColor: "rgba(221,221,221,0.3)",
    //       }}
    //     >
    //       <View
    //         style={{
    //           backgroundColor: "rgba(153,153,153,0.7)",
    //           height: 50, // 引っ張り出す部分を露出させたいので、初期位置のsnapPointsと同じ高さを指定する
    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <View
    //           style={{
    //             backgroundColor: "gray",
    //             height: 5,
    //             width: 40,
    //           }}
    //         />
    //       </View>
    //       <View
    //         style={{
    //           backgroundColor: "rgba(230,230,255,0.8)",
    //           paddingLeft: 16,
    //           paddingRight: 16,
    //           flexGrow: 1,
    //         }}
    //       >
    //         <View style={{ height: "100%" }}>
    //           <Text>modal contents here</Text>
    //         </View>
    //       </View>
    //     </View>
  );
  return (
    <>
      {location !== undefined ? (
        <>
          <MapView
            className="flex-1 h-screen"
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{
              latitude: location!.lat,
              longitude: location!.lng,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            <Marker
              pinColor="red"
              coordinate={{ latitude: Number(lat), longitude: Number(lng) }}
            >
              <Callout>
                <View>
                  <Text>{name}</Text>
                </View>
              </Callout>
            </Marker>
          </MapView>
          <View style={{ flex: 1, padding: 24, backgroundColor: "grey" }}>
            <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges}>
              <BottomSheetView style={{ flex: 1, alignItems: "center" }}>
                <Text>Awesome 🎉</Text>
              </BottomSheetView>
            </BottomSheet>
          </View>
          {/* <View style={{ height: 300, padding: 16 }}>
            <Image
              style={{ width: 350, height: 200 }}
              source={require("@/assets/images/dashi.png")}
            />
            <Text>{name}</Text>
            <Pressable
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onPress={() => {}}
            >
              <Text>AR起動"</Text>
            </Pressable>
          </View> */}
          {/*  */}
        </>
      ) : null}
    </>
  );
}

// const styles = StyleSheet.creat({
//   modalWrapper: {
//     backgroundColor: "rgba(221,221,221,0.3)",
//   },
//   modalHeader: {
//     backgroundColor: "rgba(153,153,153,0.7)",
//     height: 50, // 引っ張り出す部分を露出させたいので、初期位置のsnapPointsと同じ高さを指定する
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   modalPulltab: {
//     backgroundColor: "gray",
//     height: 5,
//     width: 40,
//   },
//   modalContents: {
//     backgroundColor: "rgba(230,230,255,0.8)",
//     paddingLeft: 16,
//     paddingRight: 16,
//     flexGrow: 1,
//   },
// });
