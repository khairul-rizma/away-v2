// src/screens/LogLeaveScreen.js
// Users pick a leave type, select dates, add an optional note,
// choose visibility, and submit. On success → SuccessScreen.

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { colors, spacing, radius, leaveTypes } from '../theme';

// Leave type options shown as chips
const LEAVE_TYPES = [
    { key: 'annual', label: '✈  Annual' },
    { key: 'sick', label: '+  Sick' },
    { key: 'ph', label: '★  Public Holiday' },
    { key: 'wfh', label: '⌂  WFH' },
    { key: 'other', label: '…  Other' },
];

export default function LogLeaveScreen({ navigation }) {
    const [selectedType, setSelectedType] = useState('annual');
    const [fromDate, setFromDate] = useState('Mon, 5 May');
    const [toDate, setToDate] = useState('');
    const [note, setNote] = useState('');
    const [visibleToAll, setVisibleToAll] = useState(true);

    const typeConfig = leaveTypes[selectedType] || leaveTypes.other;

    function handleSubmit() {
        if (!fromDate) {
            Alert.alert('No date selected', 'Please choose a start date for your leave.');
            return;
        }
        // In a real app, you would POST to your API here.
        // For now we navigate straight to the success screen.
        navigation.replace('Success', {
            leaveType: typeConfig.label,
            fromDate,
            duration: toDate ? `${fromDate} – ${toDate}` : '1 day',
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Log Leave</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {/* Leave type section */}
                <Text style={styles.sectionLabel}>What kind of leave?</Text>
                <View style={styles.chipsRow}>
                    {LEAVE_TYPES.map((lt) => {
                        const isSelected = lt.key === selectedType;
                        const cfg = leaveTypes[lt.key] || leaveTypes.other;
                        return (
                            <TouchableOpacity
                                key={lt.key}
                                style={[
                                    styles.chip,
                                    isSelected
                                        ? { backgroundColor: cfg.bg, borderColor: cfg.color, borderWidth: 1.5 }
                                        : styles.chipUnselected,
                                ]}
                                onPress={() => setSelectedType(lt.key)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.chipText, { color: isSelected ? cfg.textColor : '#888', fontWeight: isSelected ? '600' : '400' }]}>
                                    {lt.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Date section */}
                <Text style={styles.sectionLabel}>When?</Text>
                <View style={styles.datesRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.dateSubLabel}>From</Text>
                        <TouchableOpacity
                            style={[styles.dateBox, { borderColor: typeConfig.color, backgroundColor: typeConfig.bg }]}
                            onPress={() => Alert.alert('Date picker', 'Integrate a date-picker library here (e.g. react-native-calendars).')}
                        >
                            <Text style={[styles.dateBoxText, { color: typeConfig.color }]}>
                                {fromDate || 'Start date'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.dateSubLabel}>To</Text>
                        <TouchableOpacity
                            style={[styles.dateBox, { borderColor: '#DDD', backgroundColor: colors.white }]}
                            onPress={() => Alert.alert('Date picker', 'Integrate a date-picker library here (e.g. react-native-calendars).')}
                        >
                            <Text style={styles.dateBoxPlaceholder}>{toDate || 'End date'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Duration hint */}
                <View style={[styles.durationHint, { backgroundColor: typeConfig.bg }]}>
                    <Text style={styles.durationText}>
                        <Text style={{ fontWeight: '600' }}>1 day selected</Text> · Tap "To" to add an end date
                    </Text>
                </View>

                {/* Note section */}
                <Text style={styles.sectionLabel}>
                    Note <Text style={styles.optional}>(optional)</Text>
                </Text>
                <TextInput
                    style={styles.noteInput}
                    placeholder="Let your team know anything useful..."
                    placeholderTextColor={colors.textDisabled}
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />

                {/* Visibility toggle */}
                <View style={styles.toggleRow}>
                    <View>
                        <Text style={styles.toggleLabel}>Visible to</Text>
                        <Text style={styles.toggleSub}>{visibleToAll ? 'Whole team' : 'Manager only'}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.toggle, { backgroundColor: visibleToAll ? typeConfig.color : '#DDD' }]}
                        onPress={() => setVisibleToAll(!visibleToAll)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.toggleThumb, visibleToAll ? styles.thumbRight : styles.thumbLeft]} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Sticky submit footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.submitBtn, { backgroundColor: typeConfig.color }]} onPress={handleSubmit} activeOpacity={0.85}>
                    <Text style={styles.submitText}>Submit leave</Text>
                </TouchableOpacity>
                <Text style={styles.footerNote}>Your team will be notified instantly.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },

    header: {
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

    scroll: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingBottom: 100 },

    sectionLabel: { fontSize: 11, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 4 },
    optional: { fontWeight: '400', color: colors.textDisabled },

    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.lg },
    chip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 8 },
    chipUnselected: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E5E5E5' },
    chipText: { fontSize: 11 },

    datesRow: { flexDirection: 'row', gap: 9, marginBottom: 10 },
    dateSubLabel: { fontSize: 9, color: '#AAA', marginBottom: 4 },
    dateBox: { borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: 10, paddingVertical: 10 },
    dateBoxText: { fontSize: 12, fontWeight: '600' },
    dateBoxPlaceholder: { fontSize: 12, color: colors.textDisabled },

    durationHint: { borderRadius: 8, padding: 9, marginBottom: spacing.lg },
    durationText: { fontSize: 10, color: '#333' },

    noteInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: radius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 12,
        color: colors.textPrimary,
        minHeight: 60,
        marginBottom: spacing.md,
    },

    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 0.5,
        borderTopColor: '#EEE',
    },
    toggleLabel: { fontSize: 12, fontWeight: '600', color: '#333' },
    toggleSub: { fontSize: 9, color: '#AAA', marginTop: 2 },
    toggle: { width: 38, height: 21, borderRadius: 11, justifyContent: 'center', paddingHorizontal: 2 },
    toggleThumb: { width: 17, height: 17, borderRadius: 9, backgroundColor: colors.white },
    thumbRight: { alignSelf: 'flex-end' },
    thumbLeft: { alignSelf: 'flex-start' },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        borderTopWidth: 0.5,
        borderTopColor: '#EEE',
        padding: spacing.md,
        paddingBottom: 28,
    },
    submitBtn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginBottom: 5 },
    submitText: { fontSize: 14, fontWeight: '600', color: colors.white },
    footerNote: { fontSize: 9, color: colors.textDisabled, textAlign: 'center' },
});