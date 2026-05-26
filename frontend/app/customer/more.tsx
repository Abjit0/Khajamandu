import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../api/client';

const COLORS = {
  primaryOrange: '#E6753A',
  backgroundCream: '#F8F4E9',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
  lightGray: '#F0F0F0',
};

// A single menu row with icon, label and arrow
function MenuItem({ icon, label, onPress, danger }) {
  const textColor = danger ? '#E53935' : COLORS.textDark;
  const iconColor = danger ? '#E53935' : COLORS.primaryOrange;

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text style={[styles.menuLabel, { color: textColor }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textGray} />
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const router = useRouter();

  // Ask the user to confirm before logging out
  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          // Clear saved token and user data
          await authAPI.clearAuthData();
          // Go back to login screen
          router.replace('/');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.heading}>More</Text>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem icon="person-outline" label="My Profile" onPress={() => router.push('/profile')} />
          <MenuItem icon="mail-outline" label="Inbox" onPress={() => router.push('/customer/inbox')} />
          <MenuItem icon="receipt-outline" label="My Orders" onPress={() => router.push('/customer/baskets')} />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem
            icon="help-circle-outline"
            label="Help & FAQ"
            onPress={() => Alert.alert('Help', 'For support, contact us at support@khajamandu.com')}
          />
          <MenuItem
            icon="information-circle-outline"
            label="About Khajamandu"
            onPress={() => Alert.alert('About', 'Khajamandu v1.0\nFood delivery for Kathmandu.')}
          />
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <MenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} danger={true} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 24,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});
