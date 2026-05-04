// src/screens/AuthScreen.js
// Handles both Sign Up and Log In.
// The mode ('signup' | 'login') is passed via navigation params.
// Toggle between modes using the footer link.

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

// A simple labelled text input used in the form
function Field({ label, placeholder, value, onChangeText, secureTextEntry = false, hint = '' }) {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textDisabled}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
            />
            {!!hint && <Text style={styles.fieldHint}>{hint}</Text>}
        </View>
    );
}

export default function AuthScreen({ navigation, route }) {
    // Start in signup or login mode based on where the user came from
    const initialMode = route?.params?.mode || 'signup';
    const [mode, setMode] = useState(initialMode);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [agreed, setAgreed] = useState(false);

    const isSignup = mode === 'signup';

    function handleSubmit() {
        // Basic validation — in a real app you'd call an API here
        if (!email || !password) {
            Alert.alert('Missing fields', 'Please fill in your email and password.');
            return;
        }
        if (isSignup && !name) {
            Alert.alert('Missing name', 'Please enter your full name.');
            return;
        }
        if (isSignup && !agreed) {
            Alert.alert('Terms required', 'Please agree to the Terms of Service to continue.');
            return;
        }
        // Navigate to the main app
        navigation.replace('MainTabs');
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.white }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* App logo */}
                <Text style={styles.logo}>away</Text>

                {/* Heading */}
                <Text style={styles.heading}>{isSignup ? 'Create your account' : 'Welcome back.'}</Text>
                <Text style={styles.subheading}>
                    {isSignup ? 'Free for teams up to 20 people.' : "Sign in to see your team's schedule."}
                </Text>

                {/* Signup-only: name field */}
                {isSignup && (
                    <Field
                        label="Full name"
                        placeholder="e.g. Sofía Morales"
                        value={name}
                        onChangeText={setName}
                    />
                )}

                <Field
                    label="Work email"
                    placeholder="you@company.com"
                    value={email}
                    onChangeText={setEmail}
                />

                <Field
                    label="Password"
                    placeholder={isSignup ? 'Min. 8 characters' : '••••••••'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* Signup-only: team invite code */}
                {isSignup && (
                    <Field
                        label="Team invite code (optional)"
                        placeholder="e.g. TEAM-4821"
                        value={teamCode}
                        onChangeText={setTeamCode}
                        hint="Ask your manager for this 8-digit code"
                    />
                )}

                {/* Login-only: forgot password */}
                {!isSignup && (
                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: spacing.lg }}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                )}

                {/* Signup-only: T&C checkbox */}
                {isSignup && (
                    <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed(!agreed)}>
                        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                            {agreed && <Text style={{ fontSize: 9, color: colors.primary }}>✓</Text>}
                        </View>
                        <Text style={styles.checkLabel}>
                            I agree to the{' '}
                            <Text style={{ color: colors.primary }}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Primary CTA */}
                <TouchableOpacity style={styles.cta} onPress={handleSubmit} activeOpacity={0.85}>
                    <Text style={styles.ctaText}>{isSignup ? 'Create account' : 'Sign in'}</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Biometric / Face ID */}
                <TouchableOpacity style={styles.biometricBtn}>
                    <Text style={styles.biometricText}>⬡  Sign in with Face ID</Text>
                </TouchableOpacity>

                {/* Switch mode */}
                <TouchableOpacity
                    style={styles.switchRow}
                    onPress={() => setMode(isSignup ? 'login' : 'signup')}
                >
                    <Text style={styles.switchText}>
                        {isSignup ? 'Already have an account? ' : 'New here? '}
                        <Text style={{ color: colors.primary, fontWeight: '500' }}>
                            {isSignup ? 'Sign in' : 'Create an account →'}
                        </Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: spacing.lg, paddingTop: spacing.xl },

    logo: { fontSize: 22, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
    heading: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
    subheading: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.lg },

    fieldWrapper: { marginBottom: spacing.md },
    fieldLabel: { fontSize: 10, fontWeight: '600', color: '#555', marginBottom: 4 },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: radius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        color: colors.textPrimary,
    },
    fieldHint: { fontSize: 9, color: colors.textMuted, marginTop: 3 },

    forgotText: { fontSize: 11, color: colors.primary, fontWeight: '500' },

    checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: spacing.md },
    checkbox: {
        width: 14,
        height: 14,
        borderRadius: 3,
        backgroundColor: colors.primaryLight,
        borderWidth: 1.5,
        borderColor: '#CCC',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxChecked: { borderColor: colors.primary },
    checkLabel: { flex: 1, fontSize: 10, color: '#777', lineHeight: 15 },

    cta: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    ctaText: { fontSize: 13, fontWeight: '600', color: colors.white },

    divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.md },
    dividerLine: { flex: 1, height: 0.5, backgroundColor: '#EEE' },
    dividerText: { fontSize: 10, color: '#CCC' },

    biometricBtn: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: radius.md,
        paddingVertical: 13,
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    biometricText: { fontSize: 12, color: '#555' },

    switchRow: { alignItems: 'center', paddingBottom: spacing.xl },
    switchText: { fontSize: 11, color: colors.textMuted },
});