import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

const COLORS = { primary: '#E6753A', bg: '#F5F5F5', white: '#FFF', gray: '#888' };

export default function InboxScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>INBOX</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {/* 'notifications' is valid in Ionicons */}
        <TabButton icon="notifications" text="All" active />
        
        {/* CHANGED: 'megaphone-outline' is the correct Ionicons name for a bullhorn/speaker */}
        <TabButton icon="megaphone-outline" text="General" />
        
        {/* These use MaterialCommunityIcons, names are correct */}
        <TabButton icon="package-variant-closed" text="Order" isMaterial />
        <TabButton icon="ticket-percent-outline" text="Offers" isMaterial />
      </View>

      {/* Empty State Content */}
      <View style={styles.content}>
        <View style={styles.circle}>
          <Ionicons name="mail-open-outline" size={40} color="#CCC" />
        </View>
        <Text style={styles.emptyTitle}>No notification found</Text>
        <Text style={styles.emptySub}>You have currently no notification.</Text>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

// 1. Define Props Interface
interface TabButtonProps {
  icon: any;
  text: string;
  active?: boolean; 
  isMaterial?: boolean; 
}

// 2. Apply Interface
const TabButton = ({ icon, text, active = false, isMaterial = false }: TabButtonProps) => (
  <TouchableOpacity style={styles.tabItem}>
    <View style={[styles.iconCircle, active && { backgroundColor: '#FFEB3B' }]}>
       {isMaterial ? 
         <MaterialCommunityIcons name={icon} size={20} color={active ? '#000' : '#888'} /> :
         <Ionicons name={icon} size={20} color={active ? '#000' : '#888'} />
       }
    </View>
    <Text style={styles.tabText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: COLORS.primary, padding: 15, paddingTop: 40, alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: COLORS.white },
  tabItem: { alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  tabText: { fontSize: 12, color: '#555' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  circle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  emptySub: { fontSize: 14, color: '#888' },
});