// src/screens/CalendarScreen.js
// Monthly view with coloured dots showing team absences per day.
// Tap a date to see a summary sheet of who is out.

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import LeaveBadge from '../components/LeaveBadge';
import Avatar from '../components/Avatar';
import { colors, spacing, radius, leaveTypes } from '../theme';

// Placeholder absence data: day-of-month → array of leave type colours
const ABSENCES = {
    3: [colors.annual, colors.sick, colors.publicHoliday],
    5: [colors.annual],
    6: [colors.annual],
    7: [colors.annual],
    9: [colors.wfh],
    12: [colors.annual],
    13: [colors.annual],
    20: [colors.sick],
    25: [colors.publicHoliday],
};

// Who is out per day (for detail view)
const ABSENCE_DETAILS = {
    3: [
        { name: 'Marcus Lee', type: 'annual' },
        { name: 'Priya Nair', type: 'sick' },
        { name: 'Jin Park', type: 'ph' },
    ],
    5: [{ name: 'Marcus Lee', type: 'annual' }],
    9: [{ name: 'Amir Hassan', type: 'wfh' }],
    25: [{ name: 'Jin Park', type: 'ph' }],
};

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const LEGEND = [
    { key: 'annual', label: 'Annual' },
    { key: 'sick', label: 'Sick' },
    { key: 'ph', label: 'Public Holiday' },
    { key: 'wfh', label: 'WFH' },
];

export default function CalendarScreen({ navigation }) {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth()); // 0-indexed

    // First day of month (0=Sun) and total days in month
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Build a 35-cell grid (5 weeks)
    const cells = [];
    for (let i = 0; i < 35; i++) {
        const day = i - firstDow + 1;
        cells.push(day >= 1 && day <= daysInMonth ? day : null);
    }

    function prevMonth() {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    }
    function nextMonth() {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    }

    function onDayPress(day) {
        const people = ABSENCE_DETAILS[day];
        if (!people || people.length === 0) {
            Alert.alert(`${day} ${MONTHS[month]}`, 'No absences on this day.');
        } else {
            const names = people.map(p => `• ${p.name} (${leaveTypes[p.type]?.label || p.type})`).join('\n');
            Alert.alert(`Away on ${day} ${MONTHS[month]}`, names);
        }
    }

    const absenceCount = Object.values(ABSENCES).flat().length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Teal header with month navigation */}
            <View style={styles.header}>
                <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                    <Text style={styles.navIcon}>‹</Text>
                </TouchableOpacity>
                <View style={styles.monthInfo}>
                    <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
                    <Text style={styles.absenceCount}>{absenceCount} absences this month</Text>
                </View>
                <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                    <Text style={styles.navIcon}>›</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Day-of-week headers */}
                <View style={styles.dayHeaders}>
                    {DAYS.map((d, i) => (
                        <View key={i} style={styles.dayHeaderCell}>
                            <Text style={styles.dayHeaderText}>{d}</Text>
                        </View>
                    ))}
                </View>

                {/* Calendar grid */}
                <View style={styles.grid}>
                    {cells.map((day, i) => {
                        const dots = day ? (ABSENCES[day] || []) : [];
                        const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                        return (
                            <TouchableOpacity
                                key={i}
                                style={styles.cell}
                                onPress={() => day && onDayPress(day)}
                                activeOpacity={day ? 0.7 : 1}
                            >
                                <View style={[styles.dayCircle, isToday && styles.todayCircle]}>
                                    <Text style={[styles.dayText, !day && styles.dayEmpty, isToday && styles.todayText]}>
                                        {day || ''}
                                    </Text>
                                </View>
                                <View style={styles.dotsRow}>
                                    {dots.slice(0, 3).map((c, di) => (
                                        <View key={di} style={[styles.dot, { backgroundColor: c }]} />
                                    ))}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Legend */}
                <View style={styles.legend}>
                    {LEGEND.map((item) => (
                        <View key={item.key} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: leaveTypes[item.key]?.color || colors.other }]} />
                            <Text style={styles.legendLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.tip}>Tap a date to see who's out</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },

    header: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    navBtn: { padding: spacing.sm },
    navIcon: { fontSize: 22, color: 'rgba(255,255,255,0.75)' },
    monthInfo: { flex: 1, alignItems: 'center' },
    monthTitle: { fontSize: 16, fontWeight: '700', color: colors.white },
    absenceCount: { fontSize: 9, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

    scrollContent: { paddingHorizontal: spacing.sm, paddingBottom: 32 },

    dayHeaders: { flexDirection: 'row', marginTop: spacing.sm },
    dayHeaderCell: { flex: 1, alignItems: 'center', paddingVertical: 4 },
    dayHeaderText: { fontSize: 9, fontWeight: '600', color: '#AAA' },

    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: { width: '14.28%', alignItems: 'center', paddingVertical: 2 },
    dayCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayCircle: { backgroundColor: colors.primary },
    dayText: { fontSize: 11, color: '#333' },
    todayText: { color: colors.white, fontWeight: '700' },
    dayEmpty: { color: '#DDD' },
    dotsRow: { flexDirection: 'row', gap: 2, marginTop: 2, height: 6 },
    dot: { width: 5, height: 5, borderRadius: 3 },

    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        padding: spacing.md,
        borderTopWidth: 0.5,
        borderTopColor: '#EEE',
        marginTop: spacing.sm,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendLabel: { fontSize: 10, color: '#777' },

    tip: { textAlign: 'center', fontSize: 10, color: '#CCC', marginTop: 4, marginBottom: 10 },
});