// src/screens/ProfileScreen.js
// Shows the user's profile, leave balance, and app settings.
// Sign out navigates back to the Welcome/Auth screen.

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    StatusBar,
    Switch,
} from 'react-native';
import Avatar from '../components/Avatar';
import { colors, spacing, radius } from '../theme';

const LEAVE_STATS = [
    { value: '20', color: colors.primary, label: 'Total' },
    { value: '5', color: colors.publicHoliday, label: 'Used' },
    { value: '15', color: colors.primaryMid, label: 'Left' },
];

export default function ProfileScreen({ navigation }) {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    function handleSignOut() {
        Alert.alert(
            'Sign out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign out',
                    style: 'destructive',
                    onPress: () => navigation.replace('Auth', { mode: 'login' }),
                },
            ]
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Teal profile header */}
            <View style={styles.profileHeader}>
                <View style={styles.profileRow}>
                    <Avatar name="Sofía Morales" size={48} color="rgba(255,255,255,0.25)" />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.profileName}>Sofía Morales</Text>
                        <Text style={styles.profileRole}>Product Manager · Acme Corp</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => Alert.alert('Edit profile', 'Opens inline edit for name and role.')}
                    >
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Leave balance card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.sectionLabel}>LEAVE BALANCE 2026</Text>
                    <View style={styles.statsRow}>
                        {LEAVE_STATS.map((s) => (
                            <View key={s.label} style={styles.statBox}>
                                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                    {/* Progress bar */}
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: '25%' }]} />
                    </View>
                    <Text style={styles.progressNote}>5 of 20 annual days used</Text>
                </View>

                {/* Settings: Notifications */}
                <Text style={styles.groupLabel}>NOTIFICATIONS</Text>
                <View style={styles.settingsGroup}>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingIcon}>🔔</Text>
                        <Text style={styles.settingLabel}>Push notifications</Text>
                        <Switch
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                            trackColor={{ false: '#DDD', true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>
                    <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.settingIcon}>📧</Text>
                        <Text style={styles.settingLabel}>Email digest</Text>
                        <Text style={styles.settingRight}>Daily</Text>
                    </View>
                </View>

                {/* Settings: Team */}
                <Text style={styles.groupLabel}>TEAM</Text>
                <View style={styles.settingsGroup}>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => Alert.alert('Manage team', 'Opens team management screen.')}
                    >
                        <Text style={styles.settingIcon}>◉</Text>
                        <Text style={styles.settingLabel}>Manage team</Text>
                        <Text style={styles.settingRight}>8 members →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.settingRow, { borderBottomWidth: 0 }]}
                        onPress={() => Alert.alert('Invite', 'Opens invite teammate flow.')}
                    >
                        <Text style={styles.settingIcon}>⊕</Text>
                        <Text style={styles.settingLabel}>Invite teammates</Text>
                        <Text style={styles.settingRight}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings: Account */}
                <Text style={styles.groupLabel}>ACCOUNT</Text>
                <View style={styles.settingsGroup}>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingIcon}>⚙</Text>
                        <Text style={styles.settingLabel}>Preferences</Text>
                        <Text style={styles.settingRight}>→</Text>
                    </TouchableOpacity>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingIcon}>◐</Text>
                        <Text style={styles.settingLabel}>Dark mode</Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#DDD', true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.settingRow, { borderBottomWidth: 0 }]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.settingIcon}>⊖</Text>
                        <Text style={[styles.settingLabel, { color: colors.error }]}>Sign out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    profileHeader: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        paddingBottom: 18,
    },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    profileName: { fontSize: 16, fontWeight: '700', color: colors.white },
    profileRole: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    editBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 7,
    },
    editBtnText: { fontSize: 10, color: colors.white },

    scrollContent: { padding: spacing.md, paddingBottom: 40 },

    // Balance card
    balanceCard: {
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 0.5,
        borderColor: '#DFF2E8',
    },
    sectionLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#AAA',
        letterSpacing: 0.8,
        marginBottom: spacing.sm,
    },
    statsRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.sm },
    statBox: {
        flex: 1,
        backgroundColor: colors.primaryLight,
        borderRadius: radius.sm,
        paddingVertical: 10,
        alignItems: 'center',
    },
    statValue: { fontSize: 20, fontWeight: '700' },
    statLabel: { fontSize: 8, color: '#AAA', marginTop: 2 },
    progressBg: {
        height: 6,
        backgroundColor: '#EEE',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 5,
    },
    progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
    progressNote: { fontSize: 9, color: '#AAA' },

    // Settings groups
    groupLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#AAA',
        letterSpacing: 0.8,
        marginBottom: 6,
        marginTop: 4,
    },
    settingsGroup: {
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#EEE',
        marginBottom: spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#F5F5F5',
        gap: 10,
    },
    settingIcon: { fontSize: 14, width: 20, textAlign: 'center' },
    settingLabel: { flex: 1, fontSize: 12, color: '#333' },
    settingRight: { fontSize: 10, color: '#CCC' },
});