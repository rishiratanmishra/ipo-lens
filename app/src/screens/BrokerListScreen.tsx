import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBrokers } from '../services/api';

export default function BrokerListScreen() {
    const [brokers, setBrokers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getBrokers();
        setBrokers(data);
        setLoading(false);
    };

    const openLink = (url) => {
        if (url) Linking.openURL(url);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                {/* Placeholder image if logo_url is invalid/empty, but backend sends logical URLs */}
                {item.logo_url ? (
                    <Image source={{ uri: item.logo_url }} style={styles.logo} resizeMode="contain" />
                ) : (
                    <View style={styles.logoPlaceholder}><Text>Logo</Text></View>
                )}
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.highlights}>{item.highlights}</Text>
            <TouchableOpacity style={styles.button} onPress={() => openLink(item.affiliate_link)}>
                <Text style={styles.buttonText}>Open Account</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{flex:1}} />;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <FlatList 
                data={brokers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.empty}>No Brokers listed.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    listContent: { padding: 10 },
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 12, borderRadius: 10, elevation: 3 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    logo: { width: 50, height: 50, marginRight: 15 },
    logoPlaceholder: { width: 50, height: 50, marginRight: 15, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: 'bold' },
    description: { fontSize: 12, color: '#666' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    highlights: { fontSize: 13, color: '#333', marginBottom: 15, fontStyle: 'italic' },
    button: { backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    empty: { textAlign: 'center', marginTop: 20, color: '#777' }
});
