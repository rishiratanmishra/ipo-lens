import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';
import { RouteProp, useRoute } from '@react-navigation/native';
// import { RootStackParamList } from '../navigation/AppNavigator';

// Define locally to avoid circular dependency
type LegalPageRouteParams = {
    content: string;
    title: string;
};

type LegalPageRouteProp = RouteProp<{ params: LegalPageRouteParams }, 'params'>;

export default function LegalPageScreen() {
    const { theme } = useTheme();
    const route = useRoute<LegalPageRouteProp>();
    const { content } = route.params;

    // Wrap content in basic HTML structure for styling
    const htmlContent = `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        padding: 20px;
                        color: ${theme.colors.text};
                        background-color: ${theme.colors.background};
                    }
                    h1, h2, h3, h4, h5, h6 {
                        color: ${theme.colors.text};
                    }
                    p {
                        line-height: 1.6;
                        font-size: 16px;
                    }
                    a {
                        color: ${theme.colors.primary};
                    }
                </style>
            </head>
            <body>
                ${content}
            </body>
        </html>
    `;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <WebView
                source={{ html: htmlContent }}
                style={{ backgroundColor: 'transparent' }}
                startInLoadingState
                renderLoading={() => (
                    <View style={styles.loading}>
                        <ActivityIndicator color={theme.colors.primary} />
                    </View>
                )}
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
    },
});
