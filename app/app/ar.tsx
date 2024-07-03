import React, { useState, useRef } from "react";
import {
	View,
	Image,
	Text,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { CameraView } from "expo-camera";
import MapView, { Marker } from "react-native-maps";
import { useAR } from "@/hooks/useAR";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "react-native-vision-camera";

const THRESHOLD_DISTANCE = 1000; // メートル単位
const CAMERA_FOV = 60; // カメラの視野角（度）
const BEARING_THRESHOLD = 20; // 方位角の許容誤差（度）
const TARGET_LOCATION = {
	latitude: 34.904973376782976,
	longitude: 136.99191613681407,
};

export default function NativeWindAROverlay() {
	const [camera, setCamera] = useState<any>(null);
	const [picture, setPicture] = useState<any>(null);
	const imageRef = useRef<any>();
	// const camera = useRef<Camera>(null);
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

	const takePicture = async () => {
		if (camera) {
			const image = await camera.takePictureAsync({ skipProcessing: true });
			console.log(image);
			setPicture(image.uri);
		}
	};

	const onSaveImageAsync = async () => {
		try {
			const localUri = await captureRef(camera, {
				height: 440,
				quality: 1,
			});
			await MediaLibrary.saveToLibraryAsync(localUri);
			if (camera) {
				const image = await camera.takePictureAsync({ skipProcessing: true });
				// console.log(image);
				setPicture(image.uri);
				await MediaLibrary.saveToLibraryAsync(image.uri);
			}

			if (localUri) {
				alert("Saved!");
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		// <View className="flex-1 relative">
		<View className="flex-1">
			{!picture ? (
				<>
					{/* <View className="flex-1" ref={imageRef} collapsable={false}> */}
					<CameraView
						className="flex-1"
						// ref={camera}
						collapsable={false}
						ref={(ref: any) => {
							setCamera(ref);
						}}
					>
						{showOverlay && (
							<View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center	">
								<Image
									source={require("@/assets/images/arimatsu.jpeg")}
									className="w-[80%] object-contain"
								/>
							</View>
						)}
					</CameraView>
					{/* </View> */}
					<View className="absolute top-30 left-0 right-0 bottom-0 justify-center items-center	">
						<TouchableOpacity
							className="h-20 w-20 rounded-full border-inherit border-8 m-8"
							onPress={() => {
								// takePicture();
								onSaveImageAsync();
							}}
						/>
					</View>
				</>
			) : (
				<Image source={{ uri: picture }} style={{ flex: 1 }} />
			)}
		</View>
		// </View>
	);
}
