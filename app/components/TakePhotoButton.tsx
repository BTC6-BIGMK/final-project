import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function TakePhotoButton(props: { onSaveImage: () => void }) {
	const { onSaveImage } = props;

	return (
		<TouchableOpacity
			className="h-20 w-20 m-8 justify-center items-center rounded-full bg-white"
			onPress={() => {
				onSaveImage();
			}}
		>
			<Icon name="circle-o" size={70} color="#0f2350" />
		</TouchableOpacity>
	);
}
