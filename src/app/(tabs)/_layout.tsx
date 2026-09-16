import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SakuraTheme } from '@/constants/theme';

export default function TabsLayout() {
  const router = useRouter();

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
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? 'home' : 'home'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analisis',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? 'bar-chart' : 'insert-chart-outlined'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add-placeholder"
        options={{
          title: '',
          tabBarButton: () => (
            <View style={styles.fabContainer}>
              <TouchableOpacity
                style={styles.fabButton}
                activeOpacity={0.85}
                onPress={() => router.push('/add-transaction')}
                accessibilityLabel="Catat Transaksi Cepat"
              >
                <MaterialIcons name="add" size={30} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/add-transaction');
          },
        }}
      />

      <Tabs.Screen
        name="wallets"
        options={{
          title: 'Kantong',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? 'account-balance-wallet' : 'account-balance-wallet'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
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
    height: Platform.OS === 'ios' ? 86 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
    elevation: 8,
    shadowColor: SakuraTheme.colors.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontFamily: SakuraTheme.typography.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  fabContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  fabButton: {
    top: -16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: SakuraTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: SakuraTheme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: SakuraTheme.colors.card,
  },
});
