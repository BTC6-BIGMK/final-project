import { Slot, Stack } from 'expo-router';
import { ImageBackground } from 'react-native';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

export default function RootLayout() {
    return (
        <>
            <ImageBackground source={require('@/assets/images/washi.jpeg')} className='flex-1 justify-center z-50' >
                <Slot />
            </ImageBackground>
        </>
    )
}