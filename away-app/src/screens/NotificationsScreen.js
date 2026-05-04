// src/screens/NotificationsScreen.js
// Shows all recent team leave activity.
// Unread items have a teal left border. "Mark all read" clears them.

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import Avatar from '../components/Avatar';
import LeaveBadge from '../components/LeaveBadge';
import { colors, spacing, radius, leaveTypes } from '../theme';

const INITIAL_NOTIFS = [
    {
        id: '1',
        name: 'Marcus Lee',
        type: 'annual',
        msg: 'logged 5 days Annual leave starting Monday',
        time: '8:42 AM',
        unread: true,
    },
    {
        id: '2',
        name: 'Priya Nair',
        type: 'sick',
        msg: 'is out sick today — logged this morning',
        time: '7:15 AM',
        unread: true,
    },
    {
        id: '3',
        name: 'Jin Park',
        type: 'ph',
        msg: 'marked Public Holiday on 5 May (Labour Day)',
        time: 'Yesterday',
        unread: false,
    },
    {
        id: '4',
        name: 'Lei Chen',
        type: 'annual',
        msg: 'booked 2 days annual leave: 7–8 May',
        time: 'Yesterday',
        unread: false,
    },
];

function leaveColor(type) {
    return leaveTypes[type]?.color || colors.other;
}

export default function NotificationsScreen({ navigation }) {
    const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
    const unreadCount = notifs.filter((n) => n.unread).length;

    function markAllRead() {
        setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })));
    }

    function markRead(id) {
        setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllRead}>
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionLabel}>TODAY</Text>
                {notifs.map((n) => (
                    <TouchableOpacity
                        key={n.id}
                        style={[styles.notifCard, n.unread && { borderLeftColor: leaveColor(n.type) }]}
                        onPress={() => markRead(n.id)}
                        activeOpacity={0.8}
                    >
                        {/* Avatar with unread dot */}
                        <View style={styles.avatarWrap}>
                            <Avatar name={n.name} size={34} color={leaveColor(n.type)} />
                            {n.unread && (
                                <View style={styles.unreadDot} />
                            )}
                        </View>

                        {/* Message body */}
                        <View style={styles.notifBody}>
                            <Text style={styles.notifMsg}>
                                <Text style={{ fontWeight: '600' }}>{n.name}</Text> {n.msg}
                            </Text>
                            <View style={styles.notifMeta}>
                                <Text style={styles.notifTime}>{n.time}</Text>
                                <LeaveBadge type={n.type} />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {notifs.every((n) => !n.unread) && (
                    <Text style={styles.allCaughtUp}>You're all caught up 🎉</Text>
                )}
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
        gap: 8,
    },
    backBtn: { padding: 4 },
    backIcon: { fontSize: 20, color: '#555' },
    titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    unreadBadge: {
        backgroundColor: colors.sick,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 8,
    },
    unreadText: { fontSize: 9, color: colors.white, fontWeight: '600' },
    markAllText: { fontSize: 10, color: colors.primary, fontWeight: '500' },

    scrollContent: { padding: spacing.md, paddingBottom: 32 },
    sectionLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#AAA',
        letterSpacing: 0.8,
        marginBottom: spacing.sm,
    },

    notifCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },
    avatarWrap: { position: 'relative' },
    unreadDot: {
        position: 'absolute',
        top: -1,
        right: -1,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.sick,
        borderWidth: 1.5,
        borderColor: colors.white,
    },

    notifBody: { flex: 1 },
    notifMsg: { fontSize: 11, color: colors.textPrimary, lineHeight: 15 },
    notifMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
    notifTime: { fontSize: 9, color: '#BBB' },

    allCaughtUp: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: 24 },
});