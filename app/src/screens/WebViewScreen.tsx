import React, { useLayoutEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';

export default function WebViewScreen({ navigation, route }) {
    const { url, title } = route.params;
    const { theme } = useTheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: title || 'Document',
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
        });
    }, [navigation, title, theme]);

    const isPdf = url?.toLowerCase().endsWith('.pdf');
    const uri = isPdf
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
        : url;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <WebView
                source={{ uri }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                )}
                style={{ flex: 1, backgroundColor: theme.colors.background }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    }
});
