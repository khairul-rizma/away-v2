// App.js
// This is the entry point of the Away app.
// It sets up two navigators:
//   1. A Stack navigator — for screens that slide over each other (Auth, modals, detail views)
//   2. A Bottom Tab navigator — for the main 4-tab experience (Home, Calendar, Team, Profile)
//
// Navigation flow:
//   Splash → Onboarding → Auth → MainTabs (Home | Calendar | Team | Profile)
//   Any tab can open: LogLeave, LeaveDetail, Notifications (stack screens)
//   LogLeave leads to: Success or Error state screens
import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- Import all screens ---
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';

// Tab screens
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import TeamScreen from './src/screens/TeamScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Stack-only screens (no tab bar)
import LogLeaveScreen from './src/screens/LogLeaveScreen';
import LeaveDetailScreen from './src/screens/LeaveDetailScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import ErrorScreen from './src/screens/ErrorScreen';

import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Tab icons (emoji, no extra library needed) ---
const TAB_ICONS = {
    Home: { active: '⌂', inactive: '⌂' },
    Calendar: { active: '▦', inactive: '▦' },
    Team: { active: '◉', inactive: '◉' },
    Profile: { active: '◎', inactive: '◎' },
};

// --- Bottom Tab Navigator (the main 4-tab shell) ---
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopWidth: 0.5,
                    borderTopColor: '#E8E8E8',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: '#AAAAAA',
                tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
                tabBarIcon: ({ focused }) => {
                    // We use emoji icons to avoid needing an icon library.
                    // To switch to vector icons: install react-native-vector-icons
                    // and replace this function with an Icon component.
                    const icons = TAB_ICONS[route.name];
                    return null; // emoji shown via tabBarLabel already
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: '⌂  Home' }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{ tabBarLabel: '▦  Calendar' }}
            />
            <Tab.Screen
                name="Team"
                component={TeamScreen}
                options={{ tabBarLabel: '◉  Team' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: '◎  Profile' }}
            />
        </Tab.Navigator>
    );
}

// --- Root Stack Navigator ---
// Screens listed here sit above the tab bar (no bottom nav visible).
export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false, animation: 'fade' }}
            >
                {/* Onboarding flow */}
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Auth" component={AuthScreen} />

                {/* Main app — tab shell */}
                <Stack.Screen name="MainTabs" component={MainTabs} />

                {/* Screens that slide over the tab bar */}
                <Stack.Screen
                    name="LogLeave"
                    component={LogLeaveScreen}
                    options={{ animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                    name="LeaveDetail"
                    component={LeaveDetailScreen}
                    options={{ animation: 'slide_from_right' }}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                    options={{ animation: 'slide_from_right' }}
                />

                {/* State screens */}
                <Stack.Screen
                    name="Success"
                    component={SuccessScreen}
                    options={{ animation: 'fade', gestureEnabled: false }}
                />
                <Stack.Screen
                    name="Error"
                    component={ErrorScreen}
                    options={{ animation: 'fade' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

registerRootComponent(App);
