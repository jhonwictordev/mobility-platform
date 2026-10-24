// SIMBORA Motorista — Cockpit Entry Point
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';

import DriverLoginScreen from './screens/auth/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import NavigationScreen from './screens/NavigationScreen';
import EarningsScreen from './screens/EarningsScreen';
import DocumentsScreen from './screens/DocumentsScreen';
import AccountScreen from './screens/AccountScreen';

import { useDriverStore } from './stores/driverStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0E1412',
          borderTopColor: '#284238',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FFCC45',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: 'System',
          fontWeight: '800',
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Cockpit',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🧭</Text>,
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarLabel: 'Ganhos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💰</Text>,
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          tabBarLabel: 'Veículo',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Conta',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const token = useDriverStore((state) => state.token);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!token ? (
            <Stack.Screen name="Login" component={DriverLoginScreen} />
          ) : (
            <>
              <Stack.Screen name="DriverTabs" component={DriverTabs} />
              <Stack.Screen name="Navigation" component={NavigationScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
