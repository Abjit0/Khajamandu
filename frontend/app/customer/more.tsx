import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/BottomNavBar';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

export default function MoreScreen() {
  const router = useRouter();

  const menuItems = [
    { icon: 'restaurant-outline', title: 'Become a Partner', subtitle: 'Join as a restaurant partner' },
    { icon: 'bicycle-outline', title: 'Become a Rider', subtitle: 'Deliver food and earn money' },
    { icon: 'card-outline', title: 'Payment Methods', subtitle: 'Manage your payment options' },
    { icon: 'location-outline', title: 'Saved Addresses', subtitle: 'Manage delivery locations' },
    { icon: 'shield-checkmark-outline', title: 'Privacy Policy', subtitle: 'Read our privacy policy' },
    { icon: 'document-text-outline', title: 'Terms of Service', subtitle: 'Read terms and conditions' },
    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get help and contact us' },
    { icon: 'information-circle-outline', title: 'About', subtitle: 'App version and info' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Settings and options</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickActionItem 
              icon="restaurant-outline" 
              title="Partner with us" 
              onPress={() => {}}
            />
            <QuickActionItem 
              icon="bicycle-outline" 
              title="Become Rider" 
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => {}}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const QuickActionItem = ({ icon, title, onPress }: { icon: any, title: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
    <View style={styles.quickActionIcon}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
    </View>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const MenuItem = ({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  content: { flex: 1 },
  
  section: { margin: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
  },
  
  menuItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
  },
  menuIcon: { marginRight: 15 },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: COLORS.dark },
  menuSubtitle: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
});