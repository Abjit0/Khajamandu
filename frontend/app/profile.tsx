import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  
  const handleLogout = () => {
    router.replace('/'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} /> 
        <Text style={styles.headerTitle}>MY PROFILE</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
             <Ionicons name="person" size={50} color="#BBB" />
          </View>
          <Text style={styles.name}>Zesus</Text>
          <Text style={styles.email}>zesus123@gmail.com</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem icon="heart" text="My Favorites" color="#FF5252" />
          <MenuItem icon="history" text="Order History" color="#448AFF" isMaterial />
          <MenuItem icon="location-sharp" text="Manage delivery Address" color="#FF5252" />
          
          {/* CHANGED: Switched to Ionicons 'ticket-outline' to avoid FontAwesome error */}
          <MenuItem icon="ticket-outline" text="Voucher Vault" color="#FF9800" />
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

interface MenuItemProps {
  icon: any;
  text: string;
  color: string;
  isMaterial?: boolean; 
  isFontAwesome?: boolean;
}

const MenuItem = ({ icon, text, color, isMaterial = false, isFontAwesome = false }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuIcon}>
      {isFontAwesome ? (
         <FontAwesome5 name={icon} size={20} color={color} />
      ) : isMaterial ? (
         <MaterialIcons name={icon} size={24} color={color} />
      ) : (
         <Ionicons name={icon} size={24} color={color} />
      )}
    </View>
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons name="chevron-forward" size={20} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#E6753A', padding: 15, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', padding: 30, backgroundColor: '#F5F5F5' },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666', marginBottom: 15 },
  editButton: { backgroundColor: '#E6753A', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 },
  editButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  menuContainer: { backgroundColor: '#FFF', marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuIcon: { width: 40, alignItems: 'center' },
  menuText: { flex: 1, fontSize: 14, color: '#333' },
});