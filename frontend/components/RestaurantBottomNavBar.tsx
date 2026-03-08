import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { client, authAPI } from '../api/client';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

export default function RestaurantBottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    fetchNewOrdersCount();
    const interval = setInterval(fetchNewOrdersCount, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNewOrdersCount = async () => {
    try {
      const response = await client.get('/orders/all?status=PLACED');
      if (response.data.status === 'SUCCESS') {
        setNewOrdersCount(response.data.data.length);
      }
    } catch (error) {
      console.log('Error fetching new orders count:', error);
    }
  };

  const tabs = [
    { name: 'Orders', icon: 'receipt', route: '/restaurant/orders', badge: newOrdersCount || 0 },
    { name: 'Menu', icon: 'restaurant', route: '/restaurant/menu', badge: 0 },
    { name: 'Stats', icon: 'stats-chart', route: '/restaurant/stats', badge: 0 },
    { name: 'Profile', icon: 'person', route: '/profile', badge: 0 },
  ];

  const isActive = (route: string) => {
    if (route === '/restaurant/orders') {
      return pathname === '/restaurant/orders' || pathname === '/restaurant/dashboard';
    }
    return pathname === route;
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => router.push(tab.route as any)}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isActive(tab.route) ? COLORS.primary : COLORS.gray}
            />
            {tab.badge !== undefined && tab.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.badge > 9 ? '9+' : tab.badge}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.label, isActive(tab.route) && styles.activeLabel]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
