import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../api/client';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
};

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const authData = await authAPI.getAuthData();
      if (authData.userData) {
        let userData;
        if (typeof authData.userData === 'string') {
          userData = JSON.parse(authData.userData);
        } else {
          userData = authData.userData;
        }
        
        if (userData.role !== 'admin') {
          Alert.alert('Access Denied', 'This page is only for administrators', [
            { text: 'OK', onPress: () => router.replace('/customer/home') }
          ]);
        }
      }
    } catch (error) {
      console.log('Error checking user role:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>👨‍💼 Admin Dashboard</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          This section will include:{'\n\n'}
          • Approve/Reject restaurants{'\n'}
          • Approve/Reject riders{'\n'}
          • View all orders{'\n'}
          • Manage users{'\n'}
          • Platform analytics{'\n'}
          • Revenue reports
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.dark, marginBottom: 10 },
  subtitle: { fontSize: 24, color: COLORS.primary, marginBottom: 30 },
  description: { fontSize: 16, color: COLORS.dark, textAlign: 'center', lineHeight: 28 },
});
