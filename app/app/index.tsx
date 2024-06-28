import { Button, Pressable, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, useRouter } from "expo-router";

export default function TutorialScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center">
      <Link href="/spots-map" asChild>
        <Pressable>
          <Text>スタート</Text>
        </Pressable>
      </Link>
    </View>
  );
}
