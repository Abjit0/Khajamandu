import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

export default function MoreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MORE</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.menuContainer}>
          <MenuItem icon="chatbox-ellipses-outline" text="Feedback" />
          <MenuItem icon="help-circle-outline" text="FAQs" />
          <MenuItem icon="information-circle-outline" text="About Khajamandu" />
          <MenuItem icon="cash-outline" text="Delivery Charge" />
          <MenuItem icon="document-text-outline" text="Terms and Conditions" />
          <MenuItem icon="shield-checkmark-outline" text="Privacy Policy" />
        </View>

        <View style={styles.socialSection}>
            <View style={styles.socialIcons}>
                <Ionicons name="logo-facebook" size={30} color="#3b5998" style={styles.icon} />
                <Ionicons name="logo-instagram" size={30} color="#C13584" style={styles.icon} />
                <FontAwesome5 name="tiktok" size={26} color="#000" style={styles.icon} />
            </View>
            <Text style={styles.versionText}>Version 1.1.1 @ Khajamandu Pvt. Ltd.</Text>
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

// 1. Define Props Interface
interface MenuItemProps {
  icon: any;
  text: string;
}

// 2. Apply Interface
const MenuItem = ({ icon, text }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={22} color="#444" style={{ marginRight: 15 }} />
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#E6753A', padding: 15, paddingTop: 40, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  menuContainer: { backgroundColor: '#F5F5F5', padding: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#FFF', marginBottom: 2, borderRadius: 5 },
  menuText: { fontSize: 14, color: '#333' },
  socialSection: { alignItems: 'center', marginTop: 30 },
  socialIcons: { flexDirection: 'row', marginBottom: 15 },
  icon: { marginHorizontal: 10 },
  versionText: { color: '#888', fontSize: 12 },
});