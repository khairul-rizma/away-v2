// src/screens/HomeScreen.js

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import LeaveBadge from '../components/LeaveBadge';
import { colors, spacing, radius, leaveTypes } from '../theme';

// --- Synced Data from TeamScreen ---
const AWAY_TODAY = [
    { id: 'tt3', name: 'Afra', type: 'annual', note: 'Leave · Returns tomorrow' },
    { id: 'm4', name: 'Dai Rong', type: 'wfh', note: 'Working from home' },
    { id: 'd4', name: 'Preeyaphat', type: 'sick', note: 'Unwell today' },
    { id: 's3', name: 'Aiman', type: 'ph', note: 'Holiday' },
    { id: 'c5', name: 'Sawsan', type: 'annual', note: 'Leave · Returns 12 May' },
    { id: 'ch2', name: 'Nhan', type: 'annual', note: 'Family trip' },
    { id: 'ch3', name: 'Kai', type: 'sick', note: 'Unwell today' },
];

const COMING_UP = [
    { id: 'tt1', name: 'Zulhakim', date: 'Tue 6 May', type: 'wfh', note: 'WFH day' },
    { id: 'd1', name: 'Alex', date: 'Wed–Thu 7–8 May', type: 'annual', note: 'Conference' },
];

function leaveColor(type) {
    return leaveTypes?.[type]?.color || colors?.other || '#DDD';
}

// Upgraded row with better spacing and alignment
function PersonRow({ person, onPress, showDate = false }) {
    return (
        <TouchableOpacity style={styles.personRow} onPress={onPress} activeOpacity={0.6}>
            <Avatar name={person.name} size={38} color={leaveColor(person.type)} />
            <View style={styles.personInfo}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personNote} numberOfLines={1}>
                    {showDate ? `${person.date} · ${person.note}` : person.note}
                </Text>
            </View>
            <View style={styles.badgeContainer}>
                <LeaveBadge type={person.type} />
            </View>
        </TouchableOpacity>
    );
}

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const today = new Date();
    const dayName = today.toLocaleDateString('en-MY', { weekday: 'long' });
    const fullDate = today.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

            {/* Upgraded Teal header with dynamic padding applied inline */}
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Good morning,</Text>
                        <Text style={styles.userName}>Khairul Rizma 👋</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.bellBtn}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Text style={styles.bellIcon}>🔔</Text>
                        <View style={styles.unreadDot} />
                    </TouchableOpacity>
                </View>

                {/* Contextual Info Bar */}
                <View style={styles.headerBottom}>
                    <View>
                        <Text style={styles.dayText}>{dayName}</Text>
                        <Text style={styles.dateText}>{fullDate}</Text>
                    </View>
                    <View style={styles.balancePill}>
                        <Text style={styles.balanceText}>15 Days Left</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Away today card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardTitleRow}>
                            <Text style={styles.cardTitle}>Away today</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{AWAY_TODAY.length}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
                            <Text style={styles.seeAll}>See all →</Text>
                        </TouchableOpacity>
                    </View>

                    {AWAY_TODAY.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <Text style={styles.emptyIcon}>🏢</Text>
                            </View>
                            <Text style={styles.emptyTitle}>Everyone's in today!</Text>
                            <Text style={styles.emptyBody}>Your whole team is available. Enjoy the full house.</Text>
                            <TouchableOpacity
                                style={styles.emptyAction}
                                onPress={() => navigation.navigate('LogLeave')}
                            >
                                <Text style={styles.emptyActionText}>Going somewhere? Log your leave →</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        AWAY_TODAY.map((p, i) => (
                            <View key={p.id} style={[styles.rowWrapper, i < AWAY_TODAY.length - 1 && styles.rowBorder]}>
                                <PersonRow
                                    person={p}
                                    onPress={() => navigation.navigate('LeaveDetail', { person: p })}
                                />
                            </View>
                        ))
                    )}
                </View>

                {/* Coming up card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Coming up this week</Text>
                    <View style={{ marginTop: 10 }}>
                        {COMING_UP.map((p, i) => (
                            <View key={p.id} style={[styles.rowWrapper, i < COMING_UP.length - 1 && styles.rowBorder]}>
                                <PersonRow
                                    person={p}
                                    showDate
                                    onPress={() => navigation.navigate('LeaveDetail', { person: p })}
                                />
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.viewCalendarBtn} onPress={() => navigation.navigate('Calendar')}>
                        <Text style={styles.viewCalendar}>View full calendar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating "+ Log leave" button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('LogLeave')}
                activeOpacity={0.85}
            >
                <Text style={styles.fabText}>+ Log leave</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAF9' },

    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing?.lg || 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
    userName: { fontSize: 22, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
    bellBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    bellIcon: { fontSize: 18 },
    unreadDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5A5F',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    dayText: { fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: 2 },
    dateText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
    balancePill: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    balanceText: { fontSize: 11, color: colors.white, fontWeight: '700' },

    scroll: { flex: 1, marginTop: -15 },
    scrollContent: { paddingHorizontal: spacing?.md || 16, paddingBottom: 100, paddingTop: 10 },

    card: {
        backgroundColor: colors.white,
        borderRadius: radius?.lg || 16,
        padding: spacing?.md || 16,
        marginBottom: spacing?.md || 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
    countBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    countText: { fontSize: 11, color: colors.primary, fontWeight: '700' },
    seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },

    rowWrapper: { paddingVertical: 2 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F4F2' },
    personRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    personInfo: { flex: 1, justifyContent: 'center' },
    personName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
    personNote: { fontSize: 12, color: '#888', fontWeight: '400' },
    badgeContainer: { justifyContent: 'center', alignItems: 'flex-end' },

    viewCalendarBtn: {
        marginTop: 15,
        backgroundColor: '#F5FAF7',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
    viewCalendar: { fontSize: 13, color: colors.primary, fontWeight: '700' },

    emptyState: { alignItems: 'center', paddingVertical: 30 },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F5FAF7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyIcon: { fontSize: 28 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
    emptyBody: { fontSize: 14, color: '#777', textAlign: 'center', maxWidth: 220, lineHeight: 20, marginBottom: 24 },
    emptyAction: { borderWidth: 2, borderColor: colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
    emptyActionText: { fontSize: 14, color: colors.primary, fontWeight: '700' },

    fab: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 14,
        elevation: 6,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    fabText: { fontSize: 15, fontWeight: '800', color: colors.white },
});