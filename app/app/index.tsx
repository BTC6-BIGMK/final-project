import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function TutorialScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Link href="/spots-map" asChild>
                <Pressable>
                    <Text>スタート</Text>
                </Pressable>
            </Link>
        </View>
    )
} 