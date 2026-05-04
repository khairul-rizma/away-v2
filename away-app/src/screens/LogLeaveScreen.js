// src/screens/LogLeaveScreen.js
// Users pick a leave type, select dates using a custom interactive calendar, 
// add a note, complete HR checklists, choose visibility, and submit.

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
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, leaveTypes } from '../theme';

const LEAVE_TYPES = [
    { key: 'annual', label: '✈  Annual' },
    { key: 'sick', label: '+  Sick' },
    { key: 'ph', label: '★  Public Holiday' },
    { key: 'workfromhome', label: '⌂  WFH' },
    { key: 'maternity', label: ' maternity' },
    { key: 'paternity', label: ' paternity' },
    { key: 'emergency', label: ' emergency' },
];

// Helper to format dates nicely
const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' });
};

export default function LogLeaveScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const [selectedType, setSelectedType] = useState('annual');
    const [note, setNote] = useState('');
    const [visibleToAll, setVisibleToAll] = useState(true);

    // New HR & Approval States
    const [appliedBambooHR, setAppliedBambooHR] = useState(false);
    const [managerApproved, setManagerApproved] = useState(false);

    // Date Picker State
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(null);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [calendarTarget, setCalendarTarget] = useState('from'); // 'from' or 'to'

    const typeConfig = leaveTypes[selectedType] || leaveTypes.other;

    // Calculate Duration
    let durationText = "1 day selected";
    if (fromDate && toDate) {
        const diffTime = Math.abs(toDate - fromDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        durationText = `${diffDays} days selected`;
    }

    function openCalendar(target) {
        setCalendarTarget(target);
        setIsCalendarVisible(true);
    }

    function handleSelectDate(dayNumber) {
        const selectedDate = new Date(2026, 4, dayNumber);

        if (calendarTarget === 'from') {
            setFromDate(selectedDate);
            if (toDate && selectedDate > toDate) setToDate(null);
        } else {
            if (selectedDate < fromDate) {
                Alert.alert('Invalid Date', 'End date cannot be before start date.');
                return;
            }
            setToDate(selectedDate);
        }
        setIsCalendarVisible(false);
    }

    // function handleSubmit() {
    //     if (!fromDate) {
    //         Alert.alert('No date selected', 'Please choose a start date for your leave.');
    //         return;
    //     }
    //     if (!appliedBambooHR) {
    //         Alert.alert('BambooHR Reminder', "Don't forget to officially apply in BambooHR later!");
    //     }

    //     // navigation.replace('Success', {
    //     //     leaveType: typeConfig.label,
    //     //     fromDate: formatDate(fromDate),
    //     //     duration: toDate ? `${formatDate(fromDate)} – ${formatDate(toDate)}` : '1 day',
    //     // });

    //     // Example modification in LogLeaveScreen.js handleSubmit():
    //     navigation.replace('LeaveDetail', {
    //         person: {
    //             name: 'Khairul Rizma',
    //             type: selectedType,
    //             dates: toDate ? `${formatDate(fromDate)} – ${formatDate(toDate)}` : formatDate(fromDate),
    //             duration: durationText,
    //             returns: 'Pending',
    //             note: note || 'No note provided',
    //             status: managerApproved ? 'approved' : 'pending',
    //             appliedBambooHR: appliedBambooHR
    //         }
    //     });
    // }

    function handleSubmit() {
        if (!fromDate) {
            Alert.alert('No date selected', 'Please choose a start date for your leave.');
            return;
        }
        if (!appliedBambooHR) {
            Alert.alert('BambooHR Reminder', "Don't forget to officially apply in BambooHR later!");
        }

        // --- Calculate the actual return date ---
        const lastDayOfLeave = new Date(toDate || fromDate);
        const returnDateObj = new Date(lastDayOfLeave);
        returnDateObj.setDate(returnDateObj.getDate() + 1);

        const formattedReturnDate = formatDate(returnDateObj);

        navigation.replace('LeaveDetail', {
            person: {
                name: 'Khairul Rizma',
                type: selectedType,
                dates: toDate ? `${formatDate(fromDate)} – ${formatDate(toDate)}` : formatDate(fromDate),
                duration: durationText,
                returns: formattedReturnDate,
                note: note || 'No note provided',
                status: managerApproved ? 'approved' : 'pending',
                appliedBambooHR: appliedBambooHR
            }
        });
    }

    // A reusable premium toggle component for this form
    const CustomToggle = ({ label, subLabel, value, onToggle }) => (
        <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={styles.toggleLabel}>{label}</Text>
                <Text style={styles.toggleSub}>{subLabel}</Text>
            </View>
            <TouchableOpacity
                style={[styles.toggle, { backgroundColor: value ? typeConfig.color : '#D0D5D9' }]}
                onPress={onToggle}
                activeOpacity={0.8}
            >
                <View style={[styles.toggleThumb, value ? styles.thumbRight : styles.thumbLeft]} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.6}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Log Leave</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Leave type section */}
                <Text style={styles.sectionLabel}>What kind of leave?</Text>
                <View style={styles.chipsRow}>
                    {LEAVE_TYPES.map((lt) => {
                        const isSelected = lt.key === selectedType;
                        const cfg = leaveTypes[lt.key] || leaveTypes.other;
                        return (
                            <TouchableOpacity
                                key={lt.key}
                                style={[styles.chip, isSelected ? { backgroundColor: cfg.bg, borderColor: cfg.color, borderWidth: 1.5 } : styles.chipUnselected]}
                                onPress={() => setSelectedType(lt.key)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.chipText, { color: isSelected ? cfg.textColor : '#888', fontWeight: isSelected ? '700' : '500' }]}>{lt.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Interactive Dates */}
                <Text style={styles.sectionLabel}>When?</Text>
                <View style={styles.datesRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.dateSubLabel}>From</Text>
                        <TouchableOpacity style={[styles.dateBox, { borderColor: typeConfig.color, backgroundColor: typeConfig.bg, borderWidth: 1.5 }]} onPress={() => openCalendar('from')} activeOpacity={0.7}>
                            <Text style={[styles.dateBoxText, { color: typeConfig.color }]}>{formatDate(fromDate) || 'Start date'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.dateSubLabel}>To</Text>
                        <TouchableOpacity style={[styles.dateBox, toDate && { borderColor: typeConfig.color, borderWidth: 1.5 }]} onPress={() => openCalendar('to')} activeOpacity={0.7}>
                            <Text style={toDate ? [styles.dateBoxText, { color: typeConfig.color }] : styles.dateBoxPlaceholder}>
                                {toDate ? formatDate(toDate) : 'End date'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.durationHint, { backgroundColor: typeConfig.bg }]}>
                    <Text style={[styles.durationText, { color: typeConfig.textColor }]}>
                        <Text style={{ fontWeight: '700' }}>{durationText}</Text> {!toDate && '· Tap "To" to add an end date'}
                    </Text>
                </View>

                {/* Note Section */}
                <Text style={styles.sectionLabel}>Note <Text style={styles.optional}>(optional)</Text></Text>
                <TextInput style={styles.noteInput} placeholder="Let your team know anything useful..." placeholderTextColor="#A0AAB2" value={note} onChangeText={setNote} multiline textAlignVertical="top" />

                {/* HR & Approvals Section */}
                <Text style={[styles.sectionLabel, { marginTop: 4 }]}>HR & Approvals</Text>
                <View style={styles.toggleGroup}>
                    <CustomToggle
                        label="Applied in BambooHR?"
                        subLabel={appliedBambooHR ? "Yes, logged officially" : "Not yet"}
                        value={appliedBambooHR}
                        onToggle={() => setAppliedBambooHR(!appliedBambooHR)}
                    />
                    <CustomToggle
                        label="Manager Approved?"
                        subLabel={managerApproved ? "Yes, approved" : "Pending approval"}
                        value={managerApproved}
                        onToggle={() => setManagerApproved(!managerApproved)}
                    />
                </View>

                {/* Visibility toggle */}
                <Text style={[styles.sectionLabel, { marginTop: 12 }]}>Visibility</Text>
                <View style={[styles.toggleGroup, { marginBottom: 30 }]}>
                    <CustomToggle
                        label="Visible to"
                        subLabel={visibleToAll ? "Whole team can see this" : "Manager only"}
                        value={visibleToAll}
                        onToggle={() => setVisibleToAll(!visibleToAll)}
                    />
                </View>

            </ScrollView>

            {/* Custom Bottom Sheet Calendar Modal */}
            <Modal visible={isCalendarVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsCalendarVisible(false)} />
                    <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                        <Text style={styles.modalTitle}>Select {calendarTarget === 'from' ? 'Start' : 'End'} Date</Text>
                        <Text style={styles.modalMonth}>May 2026</Text>

                        <View style={styles.calendarGrid}>
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <Text key={`head-${i}`} style={styles.calHeader}>{d}</Text>
                            ))}
                            {/* Dummy Empty slots for May 2026 (Starts on a Friday) */}
                            {Array.from({ length: 5 }).map((_, i) => <View key={`empty-${i}`} style={styles.calCell} />)}

                            {/* Days 1 to 31 */}
                            {Array.from({ length: 31 }).map((_, i) => {
                                const dayNum = i + 1;
                                const isSelected = (calendarTarget === 'from' && fromDate?.getDate() === dayNum) ||
                                    (calendarTarget === 'to' && toDate?.getDate() === dayNum);
                                return (
                                    <TouchableOpacity
                                        key={`day-${dayNum}`}
                                        style={[styles.calCell, isSelected && { backgroundColor: typeConfig.color, borderRadius: 20 }]}
                                        onPress={() => handleSelectDate(dayNum)}
                                    >
                                        <Text style={[styles.calDayText, isSelected && { color: colors.white, fontWeight: '800' }]}>{dayNum}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Sticky Submit Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 24 }]}>
                <TouchableOpacity style={[styles.submitBtn, { backgroundColor: typeConfig.color, shadowColor: typeConfig.color }]} onPress={handleSubmit} activeOpacity={0.85}>
                    <Text style={styles.submitText}>Submit leave</Text>
                </TouchableOpacity>
                <Text style={styles.footerNote}>Your team will be notified instantly.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAF9' },
    header: { backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0F4F2', zIndex: 10 },
    backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
    backIcon: { fontSize: 24, color: '#1A1A1A' },
    headerTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },

    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 180, paddingTop: 20 },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: '#A0AAB2', marginBottom: 10, marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    optional: { fontWeight: '500', color: '#B0B8C0', textTransform: 'none', letterSpacing: 0 },

    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
    chipUnselected: { backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E5E9', elevation: 1 },
    chipText: { fontSize: 13 },

    datesRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    dateSubLabel: { fontSize: 10, color: '#A0AAB2', fontWeight: '600', marginBottom: 6 },
    dateBox: { backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E5E9', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, elevation: 1 },
    dateBoxText: { fontSize: 14, fontWeight: '700' },
    dateBoxPlaceholder: { fontSize: 14, color: '#A0AAB2', fontWeight: '500' },
    durationHint: { borderRadius: 10, padding: 12, marginBottom: 24 },
    durationText: { fontSize: 12 },

    noteInput: { backgroundColor: colors.white, borderWidth: 1, borderColor: '#E0E5E9', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: '#1A1A1A', minHeight: 80, marginBottom: 24, elevation: 1 },

    // Grouping for toggles
    toggleGroup: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: '#E0E5E9', paddingHorizontal: 16, elevation: 1, marginBottom: 16 },
    toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F4F2' },
    toggleLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    toggleSub: { fontSize: 11, color: '#A0AAB2', fontWeight: '500', marginTop: 4 },
    toggle: { width: 44, height: 24, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 2 },
    toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white },
    thumbRight: { alignSelf: 'flex-end' },
    thumbLeft: { alignSelf: 'flex-start' },

    // Custom Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle: { fontSize: 14, fontWeight: '700', color: '#A0AAB2', textAlign: 'center', marginBottom: 4 },
    modalMonth: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', textAlign: 'center', marginBottom: 20 },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    calHeader: { width: '14%', textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#A0AAB2', marginBottom: 12 },
    calCell: { width: '14%', height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    calDayText: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },

    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: '#F0F4F2', padding: 16, paddingTop: 16, elevation: 10 },
    submitBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 8, elevation: 4 },
    submitText: { fontSize: 15, fontWeight: '800', color: colors.white },
    footerNote: { fontSize: 11, color: '#A0AAB2', fontWeight: '500', textAlign: 'center' },
});