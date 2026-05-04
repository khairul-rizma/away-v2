// src/screens/TeamScreen.js
// Shows all team members, their status today, and lets you tap into their leave detail.
// This is the "Team" tab in the bottom navigation.

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    StatusBar,
} from 'react-native';
import Avatar from '../components/Avatar';
import LeaveBadge from '../components/LeaveBadge';
import { colors, spacing, radius, leaveTypes } from '../theme';

// Placeholder team data
const TEAM = [
    { id: '1', name: 'Sofía Morales', role: 'Product Manager', status: 'in', type: null },
    { id: '2', name: 'Marcus Lee', role: 'Senior Engineer', status: 'out', type: 'annual' },
    { id: '3', name: 'Priya Nair', role: 'Product Designer', status: 'out', type: 'sick' },
    { id: '4', name: 'Jin Park', role: 'QA Engineer', status: 'out', type: 'ph' },
    { id: '5', name: 'Amir Hassan', role: 'Backend Developer', status: 'in', type: null },
    { id: '6', name: 'Lei Chen', role: 'Engineering Manager', status: 'in', type: null },
    { id: '7', name: 'Yuki Tanaka', role: 'iOS Developer', status: 'in', type: null },
    { id: '8', name: 'Sara Osei', role: 'Data Analyst', status: 'in', type: null },
];

function leaveColor(type) {
    return leaveTypes[type]?.color || colors.primary;
}

export default function TeamScreen({ navigation }) {
    const [search, setSearch] = useState('');

    const filtered = TEAM.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.role.toLowerCase().includes(search.toLowerCase())
    );

    const outToday = TEAM.filter((m) => m.status === 'out').length;

    function renderMember({ item }) {
        const isOut = item.status === 'out';
        return (
            <TouchableOpacity
                style={styles.memberRow}
                onPress={() =>
                    isOut
                        ? navigation.navigate('LeaveDetail', { person: { name: item.name, type: item.type } })
                        : null
                }
                activeOpacity={isOut ? 0.7 : 1}
            >
                <Avatar name={item.name} size={38} color={isOut ? leaveColor(item.type) : colors.primaryMid} />
                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberRole}>{item.role}</Text>
                </View>
                {isOut ? (
                    <LeaveBadge type={item.type} />
                ) : (
                    <View style={styles.inBadge}>
                        <Text style={styles.inBadgeText}>In</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Team</Text>
                <Text style={styles.headerSub}>{outToday} out today · {TEAM.length} members</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchWrap}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search teammates…"
                    placeholderTextColor={colors.textDisabled}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={renderMember}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No teammates match "{search}"</Text>
                }
            />

            {/* Invite button */}
            <TouchableOpacity style={styles.inviteBtn}>
                <Text style={styles.inviteBtnText}>+ Invite a teammate</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
    headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

    searchWrap: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEE',
    },
    searchInput: {
        backgroundColor: colors.background,
        borderRadius: radius.md,
        paddingHorizontal: 12,
        paddingVertical: 9,
        fontSize: 13,
        color: colors.textPrimary,
    },

    listContent: { padding: spacing.md, paddingBottom: 80 },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: radius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 12,
    },
    memberInfo: { flex: 1 },
    memberName: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
    memberRole: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
    separator: { height: 6 },

    inBadge: {
        backgroundColor: '#E8F8F0',
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 5,
    },
    inBadgeText: { fontSize: 9, fontWeight: '600', color: colors.primaryMid },

    emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 13, marginTop: 32 },

    inviteBtn: {
        position: 'absolute',
        bottom: 72,
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: radius.full,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inviteBtnText: { fontSize: 12, fontWeight: '600', color: colors.primary },
});