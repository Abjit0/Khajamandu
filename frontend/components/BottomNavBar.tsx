import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const COLORS = {
  primaryOrange: '#E6753A',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

// 1. Define the rules for the button props
interface NavButtonProps {
  icon: any; 
  text: string;
  active: boolean;
  onPress: () => void;
}

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname(); 

  // 2. Helper to check if tab is active
  const isActive = (path: string) => pathname === path || (pathname === '/home' && path === '/home');

  return (
    <View style={styles.bottomNavBar}>
      <NavButton 
        icon="home" 
        text="Home" 
        active={isActive('/customer/home')} 
        // CHANGE: Use replace() instead of push()
        onPress={() => router.replace('/customer/home')} 
      />
      <NavButton 
        icon="mail-outline" 
        text="Inbox" 
        active={isActive('/customer/inbox')} 
        // CHANGE: Use replace() instead of push()
        onPress={() => router.replace('/customer/inbox')} 
      />
      <NavButton 
        icon="basket-outline" 
        text="Baskets" 
        active={isActive('/customer/baskets')} 
        // CHANGE: Use replace() instead of push()
        onPress={() => router.replace('/customer/baskets')} 
      />
      <NavButton 
        icon="person-outline" 
        text="Account" 
        active={isActive('/profile')} 
        onPress={() => router.replace('/profile')} 
      />
    </View>
  );
}

// 3. Apply the interface here
const NavButton = ({ icon, text, active, onPress }: NavButtonProps) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={active ? COLORS.primaryOrange : COLORS.textGray} />
    <Text style={[styles.navText, { color: active ? COLORS.primaryOrange : COLORS.textGray }]}>
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bottomNavBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 10, marginTop: 4, fontWeight: '500' }
});