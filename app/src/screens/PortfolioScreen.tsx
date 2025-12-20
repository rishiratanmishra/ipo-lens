import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';
import api from '../services/api';

export default function PortfolioScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const { theme } = useTheme();
    const [portfolio, setPortfolio] = useState([]);
    const [summary, setSummary] = useState({ total_invested: 0, total_profit: 0 });
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [ipoName, setIpoName] = useState('');
    const [investedAmount, setInvestedAmount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [status, setStatus] = useState('APPLIED'); // Default

    useEffect(() => {
        if (user) {
            loadPortfolio();
        }
    }, [user]);

    const loadPortfolio = async () => {
        try {
            const response = await api.get(`/portfolio.php?action=get&user_id=${user.id}`);
            setPortfolio(response.data.items);
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Failed to load portfolio", error);
        }
    };

    const handleAddTransaction = async () => {
        if (!ipoName || !investedAmount || !quantity) {
            Alert.alert("Error", "Please fill required fields");
            return;
        }

        try {
            const payload = {
                user_id: user.id,
                ipo_name: ipoName,
                invested_amount: parseFloat(investedAmount),
                quantity: parseInt(quantity),
                status: status
            };

            await api.post('/portfolio.php?action=add', payload);
            setModalVisible(false);
            setIpoName('');
            setInvestedAmount('');
            setQuantity('');
            loadPortfolio();
        } catch (error) {
            Alert.alert("Error", "Failed to add transaction");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ALLOTTED': return theme.colors.success;
            case 'NOT_ALLOTTED': return theme.colors.error;
            case 'SOLD': return theme.colors.secondary;
            default: return theme.colors.textSecondary;
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={[styles.summaryCard, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}>
                <Text style={styles.summaryLabel}>Total Invested</Text>
                <Text style={styles.summaryValue}>₹{summary.total_invested.toLocaleString()}</Text>

                <View style={[styles.profitContainer, { borderTopColor: 'rgba(255,255,255,0.1)' }]}>
                    <Text style={styles.summaryLabel}>Realized Profit/Loss</Text>
                    <Text style={[styles.profitValue, { color: summary.total_profit >= 0 ? theme.colors.success : theme.colors.error }]}>
                        {summary.total_profit >= 0 ? '+' : ''}₹{summary.total_profit.toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surfaceLight, shadowColor: theme.colors.text }]}>
            <View style={styles.row}>
                <Text style={[styles.ipoName, { color: theme.colors.text }]}>{item.ipo_name}</Text>
                <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>Qty: {item.quantity}</Text>
                <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>Invested: ₹{item.invested_amount}</Text>
            </View>
            {item.status === 'SOLD' && (
                <Text style={[styles.profitText, { color: item.profit_loss >= 0 ? theme.colors.success : theme.colors.error }]}>
                    P/L: ₹{item.profit_loss}
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.topBar, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.screenTitle, { color: theme.colors.text }]}>My Portfolio</Text>
                <TouchableOpacity onPress={logout}>
                    <Text style={[styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                ListHeaderComponent={renderHeader}
                data={portfolio}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity style={[styles.fab, { backgroundColor: theme.colors.secondary }]} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>Add Transaction</Text>

                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                            placeholder="IPO Name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={ipoName}
                            onChangeText={setIpoName}
                        />
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                            placeholder="Invested Amount (₹)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={investedAmount}
                            onChangeText={setInvestedAmount}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                            placeholder="Quantity"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                        />

                        {/* Simple Status Selection for MVP */}
                        <View style={styles.statusRow}>
                            {['APPLIED', 'ALLOTTED', 'NOT_ALLOTTED'].map(s => (
                                <TouchableOpacity
                                    key={s}
                                    onPress={() => setStatus(s)}
                                    style={[
                                        styles.statusOption,
                                        { borderColor: theme.colors.primary },
                                        status === s && { backgroundColor: theme.colors.primary }
                                    ]}
                                >
                                    <Text style={[styles.statusText, { color: theme.colors.primary }, status === s && { color: '#fff' }]}>{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleAddTransaction} style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: defaultTheme.colors.background },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: defaultTheme.spacing.md, alignItems: 'center', backgroundColor: '#fff' },
    screenTitle: { ...defaultTheme.typography.header, fontSize: 20 },
    logoutText: { color: defaultTheme.colors.error, fontWeight: 'bold' },
    listContent: { padding: defaultTheme.spacing.md },

    // Summary Card
    header: { marginBottom: defaultTheme.spacing.lg },
    summaryCard: {
        backgroundColor: defaultTheme.colors.primary,
        borderRadius: 12,
        padding: defaultTheme.spacing.lg,
        ...defaultTheme.shadows.card,
    },
    summaryLabel: { color: '#BDC3C7', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
    summaryValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: defaultTheme.spacing.md },
    profitContainer: { marginTop: defaultTheme.spacing.xs, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: defaultTheme.spacing.sm },
    profitValue: { fontSize: 18, fontWeight: 'bold' },

    // List Item
    card: { backgroundColor: '#fff', padding: defaultTheme.spacing.md, borderRadius: 8, marginBottom: defaultTheme.spacing.sm, ...defaultTheme.shadows.card },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: defaultTheme.spacing.xs },
    ipoName: { fontSize: 16, fontWeight: 'bold', color: defaultTheme.colors.text },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    detailText: { color: defaultTheme.colors.textSecondary },
    profitText: { fontWeight: 'bold', marginTop: 4 },

    // FAB
    fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: defaultTheme.colors.secondary, alignItems: 'center', justifyContent: 'center', elevation: 5 },
    fabText: { color: '#fff', fontSize: 32, marginTop: -2 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: defaultTheme.colors.primary },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 },
    cancelText: { color: '#666', marginRight: 20, fontSize: 16 },
    saveButton: { backgroundColor: defaultTheme.colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    statusRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    statusOption: { padding: 8, borderWidth: 1, borderColor: defaultTheme.colors.primary, borderRadius: 20, marginRight: 8, marginBottom: 8 },
    statusActive: { backgroundColor: defaultTheme.colors.primary },
    statusText: { color: defaultTheme.colors.primary, fontSize: 12 },
});
