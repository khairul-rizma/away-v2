// src/screens/OnboardingScreen.js
// A 3-step carousel that explains the app's value before the user signs up.
// Each step has: an illustration panel, headline, body copy, progress dots, and a CTA.

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
import { colors, spacing, radius } from '../theme';

// --- Placeholder data for the illustration panels ---
const TEAM_PREVIEW = [
    { name: 'Marcus Lee', type: 'annual', note: 'Family trip' },
    { name: 'Priya Nair', type: 'sick', note: 'Unwell' },
    { name: 'Jin Park', type: 'ph', note: 'Labour Day' },
];

function leaveColor(type) {
    const map = { annual: colors.annual, sick: colors.sick, ph: colors.publicHoliday, wfh: colors.wfh };
    return map[type] || colors.other;
}

// --- Panel 1: Team schedule preview ---
function Panel1() {
    return (
        <View style={[styles.panel, { backgroundColor: colors.primaryLight }]}>
            {TEAM_PREVIEW.map((p) => (
                <View key={p.name} style={styles.previewRow}>
                    <Avatar name={p.name} size={26} color={leaveColor(p.type)} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.previewName}>{p.name}</Text>
                        <Text style={styles.previewNote}>{p.note}</Text>
                    </View>
                    <LeaveBadge type={p.type} />
                </View>
            ))}
            <Text style={styles.panelMore}>+5 more this week →</Text>
        </View>
    );
}

// --- Panel 2: Leave form mini-preview ---
function Panel2() {
    return (
        <View style={[styles.panel, { backgroundColor: colors.publicHolidayLight }]}>
            <View style={styles.miniForm}>
                <Text style={styles.miniFormTitle}>✈ Log Leave</Text>
                <Text style={styles.miniFormLabel}>Leave type</Text>
                <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                    {['Annual ✓', 'Sick', 'Public Holiday'].map((l, i) => (
                        <View
                            key={l}
                            style={[
                                styles.chip,
                                i === 0
                                    ? { backgroundColor: colors.primaryLight, borderColor: colors.primary, borderWidth: 1 }
                                    : { backgroundColor: '#F5F5F5', borderColor: '#EEE', borderWidth: 1 },
                            ]}
                        >
                            <Text style={{ fontSize: 9, color: i === 0 ? colors.primary : '#999', fontWeight: i === 0 ? '600' : '400' }}>
                                {l}
                            </Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.miniFormLabel}>Dates</Text>
                <View style={[styles.datePill, { backgroundColor: colors.primaryLight }]}>
                    <Text style={{ fontSize: 10, color: colors.primary, fontWeight: '600' }}>
                        Mon 5 May → Fri 9 May · 5 days
                    </Text>
                </View>
                <View style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
                    <Text style={{ fontSize: 10, color: colors.white, fontWeight: '600' }}>Submit leave ✓</Text>
                </View>
            </View>
        </View>
    );
}

// --- Panel 3: Notifications preview ---
function Panel3() {
    const notifs = [
        { icon: '↗', bg: colors.primaryLight, tc: colors.primary, text: 'Marcus Lee logged 5 days Annual leave', time: 'just now' },
        { icon: '!', bg: colors.sickLight, tc: colors.sick, text: 'Priya Nair is out sick today', time: '2h ago' },
        { icon: '★', bg: colors.publicHolidayLight, tc: colors.publicHoliday, text: 'Public holiday next Mon · Labour Day', time: '1d ago' },
    ];
    return (
        <View style={[styles.panel, { backgroundColor: colors.wfhLight }]}>
            <View style={styles.notifsCard}>
                <Text style={styles.notifsHeader}>NOTIFICATIONS</Text>
                {notifs.map((n, i) => (
                    <View key={i} style={styles.notifRow}>
                        <View style={[styles.notifIcon, { backgroundColor: n.bg }]}>
                            <Text style={{ fontSize: 9, color: n.tc, fontWeight: '700' }}>{n.icon}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.notifText}>{n.text}</Text>
                            <Text style={styles.notifTime}>{n.time}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

// --- Step definitions ---
const STEPS = [
    {
        Panel: Panel1,
        headline: "Everyone's schedule, one glance away.",
        body: "See your whole team's availability every day — no more surprise out-of-offices.",
        dotColor: colors.primary,
    },
    {
        Panel: Panel2,
        headline: 'Log leave in under 10 seconds.',
        body: 'Pick a type, set the dates, done. Your team is notified the moment you hit submit.',
        dotColor: colors.publicHoliday,
    },
    {
        Panel: Panel3,
        headline: 'Stay ahead of every absence.',
        body: 'Get notified the moment a teammate logs leave. No more morning surprises.',
        dotColor: colors.wfh,
    },
];

export default function OnboardingScreen({ navigation }) {
    const [step, setStep] = useState(0);
    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    function handleNext() {
        if (isLast) {
            navigation.replace('Auth', { mode: 'signup' });
        } else {
            setStep((s) => s + 1);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {/* Skip button — top right */}
            <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => navigation.replace('Auth', { mode: 'signup' })}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Illustration panel */}
            <current.Panel />

            {/* Copy block */}
            <View style={styles.copyBlock}>
                <Text style={styles.headline}>{current.headline}</Text>
                <Text style={styles.body}>{current.body}</Text>
            </View>

            {/* Progress dots + CTA */}
            <View style={styles.footer}>
                <View style={styles.progressDots}>
                    {STEPS.map((s, i) => (
                        <TouchableOpacity key={i} onPress={() => setStep(i)}>
                            <View
                                style={[
                                    styles.progressDot,
                                    { backgroundColor: i === step ? current.dotColor : '#DDD', width: i === step ? 18 : 7 },
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={[styles.cta, { backgroundColor: current.dotColor }]}
                    onPress={handleNext}
                    activeOpacity={0.85}
                >
                    <Text style={styles.ctaText}>{isLast ? 'Get started →' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    skipBtn: { alignSelf: 'flex-end', padding: spacing.lg, paddingBottom: 0 },
    skipText: { fontSize: 11, color: colors.textMuted },

    panel: {
        marginHorizontal: spacing.lg,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 8,
        marginBottom: 7,
    },
    previewName: { fontSize: 10, fontWeight: '600', color: '#333' },
    previewNote: { fontSize: 9, color: '#999' },
    panelMore: { fontSize: 9, color: colors.primary, fontWeight: '500', textAlign: 'right', marginTop: 4 },

    miniForm: { backgroundColor: colors.white, borderRadius: 10, padding: 12 },
    miniFormTitle: { fontSize: 10, fontWeight: '700', color: '#333', marginBottom: 10 },
    miniFormLabel: { fontSize: 9, color: '#999', marginBottom: 4 },
    chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
    datePill: { borderRadius: 6, padding: 7, marginBottom: 9 },
    submitBtn: { borderRadius: 7, padding: 8, alignItems: 'center' },

    notifsCard: { backgroundColor: colors.white, borderRadius: 10, padding: 10 },
    notifsHeader: { fontSize: 9, fontWeight: '600', color: '#888', letterSpacing: 0.5, marginBottom: 8 },
    notifRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 7 },
    notifIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    notifText: { fontSize: 9, color: '#333', lineHeight: 13 },
    notifTime: { fontSize: 8, color: '#AAA' },

    copyBlock: { flex: 1, paddingHorizontal: 18, paddingTop: 10, justifyContent: 'flex-start' },
    headline: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, lineHeight: 24, marginBottom: 7 },
    body: { fontSize: 12, color: '#777', lineHeight: 18 },

    footer: { paddingHorizontal: 18, paddingBottom: 32 },
    progressDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 14 },
    progressDot: { height: 5, borderRadius: 3 },
    cta: { borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
    ctaText: { fontSize: 13, fontWeight: '600', color: colors.white },
});