import { Button, Pressable, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";

export default function TutorialScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={require("@/assets/images/top_icon.png")}
        style={{ width: 300, height: 300, borderRadius: 8, bottom: 50 }}
      />
      <Link href="/spots-map" asChild>
        <Pressable>
          <Image
            source={require("@/assets/images/start_button.png")}
            style={{ width: 120, height: 60, borderRadius: 8 }}
          />
        </Pressable>
      </Link>
    </View>
  );
}
