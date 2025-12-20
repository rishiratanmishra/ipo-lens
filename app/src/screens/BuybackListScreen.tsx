import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBuybacks } from '../services/api';

export default function BuybackListScreen() {
    const [buybacks, setBuybacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getBuybacks();
        setBuybacks(data);
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.companyName}>{item.company_name}</Text>
            <Text style={styles.details}>Type: {item.type}</Text>
            <Text style={styles.details}>Buyback Price: ₹{item.buyback_price}</Text>
            {item.current_market_price && <Text style={styles.details}>CMP: ₹{item.current_market_price}</Text>}
            <Text style={styles.details}>Record Date: {item.record_date || 'TBA'}</Text>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{flex:1}} />;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <FlatList 
                data={buybacks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.empty}>No Buyback offers found.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    listContent: { padding: 10 },
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
    companyName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    details: { fontSize: 14, color: '#555', marginTop: 2 },
    empty: { textAlign: 'center', marginTop: 20, color: '#777' }
});
