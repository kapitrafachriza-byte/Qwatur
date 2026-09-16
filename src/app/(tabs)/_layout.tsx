import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SakuraTheme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: SakuraTheme.colors.primary,
        tabBarInactiveTintColor: SakuraTheme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: 'Catat',
          tabBarIcon: () => (
            <View style={styles.fabIcon}>
              <MaterialIcons name="add" size={26} color="#ffffff" />
            </View>
          ),
          tabBarLabelStyle: [styles.tabBarLabel, styles.addLabel],
        }}
      />

      <Tabs.Screen
        name="wallets"
        options={{
          title: 'Kantong',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-balance-wallet" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Laporan',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="insert-chart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: SakuraTheme.colors.card,
    borderTopWidth: 1,
    borderTopColor: SakuraTheme.colors.border,
    height: Platform.OS === 'ios' ? 84 : 66,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: SakuraTheme.colors.shadowColor,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  addLabel: {
    fontWeight: '700',
    color: SakuraTheme.colors.primary,
  },
  fabIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: SakuraTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
