// src/screens/LeaveDetailScreen.js
// Shows full details for one person's absence.
// Data is passed via navigation params (person object from HomeScreen or CalendarScreen).

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import Avatar from '../components/Avatar';
import LeaveBadge from '../components/LeaveBadge';
import { colors, spacing, radius, leaveTypes } from '../theme';

// Placeholder detail data — in a real app this would come from your API
const DETAILS_MAP = {
    'Marcus Lee': {
        role: 'Senior Engineer',
        type: 'annual',
        dates: 'Mon 5 May → Fri 9 May',
        duration: '5 working days',
        returns: 'Monday, 12 May',
        note: '"Family trip to Penang 🌴"',
    },
    'Priya Nair': {
        role: 'Product Designer',
        type: 'sick',
        dates: 'Mon 3 May',
        duration: '1 day',
        returns: 'Tuesday, 4 May',
        note: 'Unwell today',
    },
    'Jin Park': {
        role: 'QA Engineer',
        type: 'ph',
        dates: 'Mon 3 May',
        duration: '1 day',
        returns: 'Tuesday, 4 May',
        note: 'Labour Day',
    },
    'Amir Hassan': {
        role: 'Backend Developer',
        type: 'wfh',
        dates: 'Tue 6 May',
        duration: '1 day',
        returns: 'Wednesday, 7 May',
        note: 'Working from home',
    },
    'Lei Chen': {
        role: 'Engineering Manager',
        type: 'annual',
        dates: 'Wed 7 May → Thu 8 May',
        duration: '2 days',
        returns: 'Friday, 9 May',
        note: 'Conference in Singapore',
    },
};

const DETAIL_ROWS = [
    { key: 'dates', label: 'Dates' },
    { key: 'duration', label: 'Duration' },
    { key: 'returns', label: 'Returns' },
    { key: 'note', label: 'Note' },
];

export default function LeaveDetailScreen({ navigation, route }) {
    // The person object is passed from whichever screen navigated here
    const { person } = route?.params || {};
    const name = person?.name || 'Marcus Lee';
    const details = DETAILS_MAP[name] || DETAILS_MAP['Marcus Lee'];
    const cfg = leaveTypes[details.type] || leaveTypes.annual;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Leave detail</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Person card */}
                <View style={styles.card}>
                    {/* Tinted header section */}
                    <View style={[styles.cardTop, { backgroundColor: cfg.bg }]}>
                        <Avatar name={name} size={56} color={cfg.color} />
                        <Text style={styles.personName}>{name}</Text>
                        <Text style={styles.personRole}>{details.role}</Text>
                        <LeaveBadge type={details.type} />
                    </View>

                    {/* Detail rows */}
                    <View style={styles.cardBody}>
                        {DETAIL_ROWS.map(({ key, label }) => (
                            <View key={key} style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{label}</Text>
                                <Text style={[styles.detailValue, key === 'note' && styles.detailNote]}>
                                    {details[key]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Message CTA */}
                <TouchableOpacity
                    style={[styles.messageBtn, { backgroundColor: cfg.color }]}
                    onPress={() => Alert.alert('Message', `Opening a message thread with ${name}...`)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.messageBtnText}>Message {name.split(' ')[0]}</Text>
                </TouchableOpacity>

                <Text style={styles.returnsNote}>
                    {name.split(' ')[0]} will be back {details.returns}.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    header: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEE',
    },
    backBtn: { padding: 4, marginRight: spacing.sm },
    backIcon: { fontSize: 20, color: '#555' },
    headerTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },

    scrollContent: { padding: spacing.md },

    card: {
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#DFF2E8',
        marginBottom: spacing.md,
    },
    cardTop: {
        padding: 18,
        alignItems: 'center',
        gap: 7,
    },
    personName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
    personRole: { fontSize: 10, color: colors.textSecondary, marginBottom: 3 },

    cardBody: { padding: spacing.md },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F5F5F5',
    },
    detailLabel: { fontSize: 10, color: '#AAA', fontWeight: '500' },
    detailValue: { fontSize: 12, color: '#333', fontWeight: '500', textAlign: 'right', maxWidth: '60%' },
    detailNote: { fontWeight: '400', fontStyle: 'italic' },

    messageBtn: {
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    messageBtnText: { fontSize: 14, fontWeight: '600', color: colors.white },

    returnsNote: { textAlign: 'center', fontSize: 10, color: colors.textMuted },
});