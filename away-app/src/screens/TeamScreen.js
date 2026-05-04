// src/screens/TeamScreen.js

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    TextInput,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import LeaveBadge from '../components/LeaveBadge';
import { colors, spacing, radius, leaveTypes } from '../theme';

// Grouped team data
const TEAMS_DATA = [
    {
        title: 'Teen Titans',
        data: [
            { id: 'tt1', name: 'Zulhakim', role: 'Teammate', status: 'in', type: null },
            { id: 'tt2', name: 'Azzam', role: 'Teammate', status: 'in', type: null },
            { id: 'tt3', name: 'Afra', role: 'Teammate', status: 'out', type: 'annual' },
        ],
    },
    {
        title: 'Metamon',
        data: [
            { id: 'm1', name: 'Kelsey', role: 'Teammate', status: 'in', type: null },
            { id: 'm2', name: 'Josh', role: 'Teammate', status: 'in', type: null },
            { id: 'm3', name: 'Ying', role: 'Teammate', status: 'in', type: null },
            { id: 'm4', name: 'Dai Rong', role: 'Teammate', status: 'out', type: 'wfh' },
        ],
    },
    {
        title: 'Durian',
        data: [
            { id: 'd1', name: 'Alex', role: 'Teammate', status: 'in', type: null },
            { id: 'd2', name: 'Chanya', role: 'Teammate', status: 'in', type: null },
            { id: 'd3', name: 'Kittipit', role: 'Teammate', status: 'in', type: null },
            { id: 'd4', name: 'Preeyaphat', role: 'Teammate', status: 'out', type: 'sick' },
            { id: 'd5', name: 'Gam', role: 'Teammate', status: 'in', type: null },
            { id: 'd6', name: 'Giang', role: 'Teammate', status: 'in', type: null },
        ],
    },
    {
        title: 'Slytherin',
        data: [
            { id: 's1', name: 'Nurul', role: 'Teammate', status: 'in', type: null },
            { id: 's2', name: 'Adilla', role: 'Teammate', status: 'in', type: null },
            { id: 's3', name: 'Aiman', role: 'Teammate', status: 'out', type: 'ph' },
            { id: 's4', name: 'Hannah', role: 'Teammate', status: 'in', type: null },
            { id: 's5', name: 'Diyana', role: 'Teammate', status: 'in', type: null },
            { id: 's6', name: 'Hazirah', role: 'Teammate', status: 'in', type: null },
        ],
    },
    {
        title: 'Carstensz',
        data: [
            { id: 'c1', name: 'Adinda', role: 'Teammate', status: 'in', type: null },
            { id: 'c2', name: 'Syamira', role: 'Teammate', status: 'in', type: null },
            { id: 'c3', name: 'Claudyo', role: 'Teammate', status: 'in', type: null },
            { id: 'c4', name: 'Dian', role: 'Teammate', status: 'in', type: null },
            { id: 'c5', name: 'Sawsan', role: 'Teammate', status: 'out', type: 'annual' },
        ],
    },
    {
        title: 'Challengers',
        data: [
            { id: 'ch1', name: 'Khairul', role: 'Teammate', status: 'in', type: null },
            { id: 'ch2', name: 'Nhan', role: 'Teammate', status: 'out', type: 'annual' },
            { id: 'ch3', name: 'Kai', role: 'Teammate', status: 'out', type: 'sick' },
            { id: 'ch4', name: 'Josh', role: 'Teammate', status: 'in', type: null },
        ],
    }
];

function leaveColor(type) {
    return leaveTypes[type]?.color || colors.primary;
}

export default function TeamScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for A-Z, 'desc' for Z-A

    // Stats
    const { totalMembers, outToday } = useMemo(() => {
        let total = 0;
        let out = 0;
        TEAMS_DATA.forEach(team => {
            total += team.data.length;
            team.data.forEach(member => {
                if (member.status === 'out') out++;
            });
        });
        return { totalMembers: total, outToday: out };
    }, []);

    // Filtering & Sorting logic
    const filteredTeams = useMemo(() => {
        // 1. Filter members
        let processedTeams = TEAMS_DATA.map(team => {
            const filteredMembers = team.data.filter(m => {
                const matchesSearch =
                    m.name.toLowerCase().includes(search.toLowerCase()) ||
                    m.role.toLowerCase().includes(search.toLowerCase());

                const matchesStatus =
                    statusFilter === 'all' || m.status === statusFilter;

                const matchesType =
                    !typeFilter || m.type === typeFilter;

                return matchesSearch && matchesStatus && matchesType;
            });

            return { ...team, data: filteredMembers };
        }).filter(team => team.data.length > 0);

        // 2. Sort Teams alphabetically
        processedTeams.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });

        return processedTeams;
    }, [search, statusFilter, typeFilter, sortOrder]);

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
                activeOpacity={isOut ? 0.6 : 1}
            >
                <Avatar name={item.name} size={46} color={isOut ? leaveColor(item.type) : '#DDF0E9'} />

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

    function renderSectionHeader({ section: { title } }) {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
                <View style={styles.sectionHeaderLine} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Elevated Teal Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>Teams</Text>

                <View style={styles.headerSubRow}>
                    <View style={styles.outPill}>
                        <Text style={styles.outPillText}>{outToday} out today</Text>
                    </View>
                    <Text style={styles.totalMembersText}>{totalMembers} members</Text>
                </View>
            </View>

            {/* Floating Search */}
            <View style={styles.searchWrap}>
                <View style={styles.searchInner}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search teammates…"
                        placeholderTextColor="#A0AAB2"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* Horizontally Scrollable Interactive Filters */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {/* Sort Toggle Button */}
                    <TouchableOpacity
                        style={styles.sortChip}
                        onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sortChipText}>
                            Sort: {sortOrder === 'asc' ? 'A-Z ↓' : 'Z-A ↑'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Status Filters */}
                    {['all', 'in', 'out'].map(status => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterChip,
                                statusFilter === status ? styles.filterChipActive : styles.filterChipInactive
                            ]}
                            onPress={() => setStatusFilter(status)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.filterText,
                                statusFilter === status ? styles.filterTextActive : styles.filterTextInactive
                            ]}>
                                {status.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.divider} />

                    {/* Leave Type Filters */}
                    {Object.keys(leaveTypes).map(type => {
                        const isActive = typeFilter === type;
                        const typeConfig = leaveTypes[type];
                        return (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.filterChip,
                                    isActive ? { backgroundColor: leaveColor(type), borderColor: leaveColor(type) } : styles.filterChipInactive
                                ]}
                                onPress={() => setTypeFilter(prev => prev === type ? null : type)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.filterText,
                                    isActive ? { color: '#fff' } : styles.filterTextInactive
                                ]}>
                                    {typeConfig.label.replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Team List */}
            <SectionList
                sections={filteredTeams}
                keyExtractor={(item) => item.id}
                renderItem={renderMember}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconCircle}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                        </View>
                        <Text style={styles.emptyTitle}>No matches found</Text>
                        <Text style={styles.emptyText}>
                            Try adjusting your filters or search term.
                        </Text>
                    </View>
                }
            />

            {/* Floating Invite Button */}
            <TouchableOpacity style={[styles.inviteBtn, { bottom: insets.bottom > 0 ? insets.bottom + 10 : 24 }]} activeOpacity={0.85}>
                <Text style={styles.inviteBtnText}>+ Invite a teammate</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAF9' },

    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing?.lg || 20,
        paddingBottom: 35,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
    headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
    outPill: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },
    outPillText: { fontSize: 11, color: '#fff', fontWeight: '800' },
    totalMembersText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },

    // Search Bar
    searchWrap: {
        paddingHorizontal: 16,
        marginTop: -24,
        marginBottom: 16,
        zIndex: 2,
    },
    searchInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    searchIcon: { fontSize: 16, marginRight: 10 },
    searchInput: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '500',
    },

    // Horizontal Filter Scroll
    filterContainer: {
        marginBottom: 12,
    },
    filterScrollContent: {
        paddingHorizontal: 16,
        gap: 8,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#D0D5D9',
        marginHorizontal: 4,
    },

    // Chips
    sortChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E5E9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    sortChipText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },

    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    filterChipInactive: {
        backgroundColor: '#fff',
        borderColor: '#E0E5E9',
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterText: { fontSize: 12, fontWeight: '700' },
    filterTextInactive: { color: '#A0AAB2' },
    filterTextActive: { color: '#fff' },

    // List & Headers
    listContent: { paddingHorizontal: 16, paddingBottom: 120 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 12,
        gap: 12,
    },
    sectionHeaderText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#A0AAB2',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    sectionHeaderLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E5E9',
    },

    // Member Card
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    memberInfo: { flex: 1, justifyContent: 'center' },
    memberName: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
    memberRole: { fontSize: 12, color: '#888', fontWeight: '500' },
    separator: { height: 12 },

    inBadge: {
        backgroundColor: '#F5FAF7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDF0E9',
    },
    inBadgeText: { fontSize: 11, fontWeight: '800', color: colors.primaryMid },

    // Empty State
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    emptyIcon: { fontSize: 28 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
    emptyText: { color: '#A0AAB2', fontSize: 14, fontWeight: '500' },

    // Floating CTA
    inviteBtn: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    inviteBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});