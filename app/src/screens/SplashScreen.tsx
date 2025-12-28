import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from '../context/ThemeContext';

interface SplashScreenProps {
    isAppReady: boolean;
}

export default function CustomSplashScreen({ isAppReady }: SplashScreenProps) {
    const { theme } = useTheme();
    const [isSplashVisible, setIsSplashVisible] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Hide the native splash screen once this component mounts
        // This ensures a seamless transition to our JS splash screen
        async function hideNativeSplash() {
            try {
                await SplashScreen.hideAsync();
            } catch (e) {
                console.warn(e);
            }
        }
        hideNativeSplash();
    }, []);

    useEffect(() => {
        if (isAppReady) {
            // Animate out
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1.5,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setIsSplashVisible(false);
            });
        }
    }, [isAppReady]);

    if (!isSplashVisible) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
            <Animated.View
                style={[
                    styles.imageContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <Image
                    source={require('../../assets/splash-icon.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure it's on top of everything
    },
    imageContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});
