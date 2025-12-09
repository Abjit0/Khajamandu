import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { client, authAPI } from '../api/client';

const COLORS = {
  primaryOrange: '#E6753A',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
  red: '#FF4444'
};

interface NavButtonProps {
  icon: any; 
  text: string;
  active: boolean;
  onPress: () => void;
  badge?: number;
}

export default function BottomNavBarWithBadge() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUnreadCount();
      // Set up polling for unread count every 5 seconds for real-time updates
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [userData]);

  const loadUserData = async () => {
    try {
      const authData = await authAPI.getAuthData();
      if (authData.userData && typeof authData.userData === 'string') {
        const parsedData = JSON.parse(authData.userData);
        setUserData(parsedData);
      } else if (authData.userData && typeof authData.userData === 'object') {
        setUserData(authData.userData);
      }
    } catch (error) {
      // Clear corrupted data
      try {
        await authAPI.clearAuthData();
      } catch (clearError) {
        // Silent error handling
      }
    }
  };

  const fetchUnreadCount = async () => {
    if (!userData) return;
    
    try {
      const response = await client.get(`/notifications/${userData.id}`);
      if (response.data.status === 'SUCCESS') {
        const count = response.data.unreadCount || 0;
        setUnreadCount(typeof count === 'number' && !isNaN(count) ? count : 0);
      }
    } catch (error) {
      setUnreadCount(0);
    }
  };

  const isActive = (path: string) => pathname === path || (pathname === '/home' && path === '/home');

  return (
    <View style={styles.bottomNavBar}>
      <NavButton 
        icon="home" 
        text="Home" 
        active={isActive('/customer/home')} 
        onPress={() => router.replace('/customer/home')} 
      />
      <NavButton 
        icon="mail-outline" 
        text="Inbox" 
        active={isActive('/customer/inbox')} 
        onPress={() => router.replace('/customer/inbox')} 
        badge={unreadCount || 0}
      />
      <NavButton 
        icon="basket-outline" 
        text="Baskets" 
        active={isActive('/customer/baskets')} 
        onPress={() => router.replace('/customer/baskets')} 
      />
      <NavButton 
        icon="person-outline" 
        text="Account" 
        active={isActive('/profile')} 
        onPress={() => router.replace('/profile')} 
      />
      <NavButton 
        icon="grid-outline" 
        text="More" 
        active={isActive('/customer/more')} 
        onPress={() => router.replace('/customer/more')} 
      />
    </View>
  );
}

const NavButton = ({ icon, text, active, onPress, badge }: NavButtonProps) => {
  const badgeCount = typeof badge === 'number' && !isNaN(badge) ? badge : 0;
  
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={active ? COLORS.primaryOrange : COLORS.textGray} />
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? '99+' : String(badgeCount)}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.navText, { color: active ? COLORS.primaryOrange : COLORS.textGray }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomNavBar: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    backgroundColor: COLORS.white, 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    paddingTop: 8, 
    paddingBottom: Platform.OS === 'ios' ? 8 : 8,
    borderTopWidth: 1, 
    borderTopColor: '#E0E0E0', 
    elevation: 10,
  },
  navItem: { 
    alignItems: 'center', 
    justifyContent: 'center',
    minWidth: 60,
  },
  iconContainer: { 
    position: 'relative',
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navText: { 
    fontSize: 12, 
    fontWeight: '500',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    backgroundColor: COLORS.red,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold'
  }
});