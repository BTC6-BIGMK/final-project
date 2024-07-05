import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function LinkButton(props: {
  link: string;
  iconName: string;
  size: number;
}) {
  const { link, iconName, size } = props;

  return (
    <Link href={link} asChild>
      <TouchableOpacity className="h-14 w-14 m-8 justify-center items-center rounded-full bg-white">
        <Icon name={iconName} size={size} color="#0f2350" />
      </TouchableOpacity>
    </Link>
  );
}
