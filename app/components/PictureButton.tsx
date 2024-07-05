import { TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function PictureButton(props: {
	onSaveSnapShot: () => void;
	onSharingSnapShot: () => void;
	returnCamera: () => void;
}) {
	const { onSaveSnapShot, onSharingSnapShot, returnCamera } = props;
	return (
		<ImageBackground
			source={require("@/assets/images/washi.jpeg")}
			className="flex-1 justify-center z-50 flex-row opacity-80"
		>
			<TouchableOpacity
				className="h-20 w-20 m-8 justify-center items-center"
				onPress={() => {
					returnCamera();
				}}
			>
				<Icon name="close" size={50} color="#0f2350" />
			</TouchableOpacity>
			<TouchableOpacity
				className="h-30 w-30  m-8 justify-center items-center"
				onPress={() => {
					onSaveSnapShot();
				}}
			>
				<Icon name="download" size={50} color="#0f2350" />
			</TouchableOpacity>
			<TouchableOpacity
				className="h-20 w-20  m-8 justify-center items-center"
				onPress={() => {
					onSharingSnapShot();
				}}
			>
				<Icon name="share" size={50} color="#0f2350" />
			</TouchableOpacity>
		</ImageBackground>
	);
}
