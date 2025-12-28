import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function OfflineNotice() {
    const netInfo = useNetInfo();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const [isVisible, setIsVisible] = useState(false);

    const isOffline = netInfo.isInternetReachable === false || netInfo.isConnected === false;

    useEffect(() => {
        if (netInfo.type === 'unknown' || netInfo.isInternetReachable === null) {
            return;
        }

        if (isOffline) {
            setIsVisible(true);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 8,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsVisible(false));
        }
    }, [isOffline, netInfo.type, netInfo.isInternetReachable]);

    if (netInfo.type === 'unknown' || netInfo.isInternetReachable === null) {
        return null;
    }

    if (!isVisible && !isOffline) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 8,
                    paddingBottom: 12,
                    transform: [{ translateY: slideAnim }],
                }
            ]}
        >
            <View style={styles.gradientOverlay} />
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Icon name="wifi-off" size={20} color="#fff" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>No Internet Connection</Text>
                    <Text style={styles.subtitle}>Please check your network settings</Text>
                </View>
            </View>
            <View style={styles.bottomAccent} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 10,
        backgroundColor: '#FF3B30', // iOS red
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        maxWidth: 300,
    },
    title: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.2,
        marginBottom: 2,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.1,
    },
    bottomAccent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
});
