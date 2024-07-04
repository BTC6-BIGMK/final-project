import React, { useEffect, useState, useRef } from "react";
import { View, Image, Text } from "react-native";
import { CameraView } from "expo-camera";
import { useAR } from "@/hooks/useAR";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import PictureButton from "@/components/PictureButton";
import TakePhotoButton from "@/components/TakePhotoButton";

const THRESHOLD_DISTANCE = 1000; // メートル単位
const CAMERA_FOV = 60; // カメラの視野角（度）
const BEARING_THRESHOLD = 20; // 方位角の許容誤差（度）
const TARGET_LOCATION = {
	//latitude: 35.1193147320576,
	//longitude: 137.0384692843589,
	latitude: 35.11307850973201,
	longitude: 137.1882824101125,
};

export default function NativeWindAROverlay() {
	const [camera, setCamera] = useState<CameraView | null>(null);
	const [picture, setPicture] = useState<string | undefined>(undefined);
	const imageRef = useRef<View>(null);
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

	const onSaveSnapShot = async () => {
		try {
			const localUri = await captureRef(imageRef);
			if (localUri) {
				await MediaLibrary.saveToLibraryAsync(localUri);
				alert("保存されました。");
				setPicture(undefined);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const onSharingSnapShot = async () => {
		try {
			const localUri = await captureRef(imageRef);
			if (localUri) {
				await MediaLibrary.saveToLibraryAsync(localUri);
				Sharing.shareAsync(localUri);
				setPicture(undefined);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const returnCamera = () => {
		setPicture(undefined);
	};

	const onSaveImage = async (): Promise<void> => {
		try {
			if (camera) {
				const image = await camera.takePictureAsync();
				setPicture(image!.uri);
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		(async () => {
			const response = await axios.get(
				`http://192.168.3.34:3000/api/area-spots/${id}/contents`
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
			{!picture ? (
				<>
					<View className="flex-1">
						<CameraView
							className="flex-1"
							collapsable={false}
							ref={(ref) => setCamera(ref)}
						>
							{showOverlay && (
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
					<View className="absolute top-30 left-0 right-0 bottom-0 justify-center items-center ">
						<TakePhotoButton onSaveImage={onSaveImage} />
					</View>
				</>
			) : (
				<>
					<View className="flex-1" ref={imageRef} collapsable={false}>
						<Image className="flex-1" source={{ uri: picture }} />
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
						<View className="absolute top-30 left-0 right-0 bottom-0 justify-center items-center ">
							<PictureButton
								onSaveSnapShot={onSaveSnapShot}
								onSharingSnapShot={onSharingSnapShot}
								returnCamera={returnCamera}
							/>
						</View>
					</View>
				</>
			)}
		</View>
	);
}
