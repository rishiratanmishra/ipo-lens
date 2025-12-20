import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBuybacks } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function BuybackListScreen() {
    const [buybacks, setBuybacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getBuybacks();
        setBuybacks(data);
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.companyName, { color: theme.colors.text }]}>{item.company_name}</Text>
            <Text style={[styles.details, { color: theme.colors.textSecondary }]}>Type: {item.type}</Text>
            <Text style={[styles.details, { color: theme.colors.textSecondary }]}>Buyback Price: ₹{item.buyback_price}</Text>
            {item.current_market_price && <Text style={[styles.details, { color: theme.colors.textSecondary }]}>CMP: ₹{item.current_market_price}</Text>}
            <Text style={[styles.details, { color: theme.colors.textSecondary }]}>Record Date: {item.record_date || 'TBA'}</Text>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1, backgroundColor: theme.colors.background }} />;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <FlatList
                data={buybacks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={[styles.empty, { color: theme.colors.textSecondary }]}>No Buyback offers found.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { padding: 10 },
    card: { padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
    companyName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    details: { fontSize: 14, marginTop: 2 },
    empty: { textAlign: 'center', marginTop: 20 }
});
