import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import RestaurantBottomNavBar from '../../components/RestaurantBottomNavBar';
import { client, authAPI } from '../../api/client';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
  success: '#4CAF50',
  warning: '#FF9800',
};

export default function RestaurantStats() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    checkUserRole();
    fetchStats();
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
        
        if (userData.role !== 'restaurant') {
          Alert.alert('Access Denied', 'This page is only for restaurant owners', [
            { text: 'OK', onPress: () => router.replace('/customer/home') }
          ]);
        }
      }
    } catch (error) {
      console.log('Error checking user role:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await client.get('/orders/all');
      if (response.data.status === 'SUCCESS') {
        const orders = response.data.data;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayOrders = orders.filter((order: any) => 
          new Date(order.createdAt) >= today
        );
        
        const todayRevenue = todayOrders.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || 0), 0
        );
        
        const totalRevenue = orders.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || 0), 0
        );
        
        const pendingOrders = orders.filter((order: any) => 
          ['PLACED', 'CONFIRMED', 'PREPARING'].includes(order.orderStatus)
        ).length;
        
        const completedOrders = orders.filter((order: any) => 
          order.orderStatus === 'DELIVERED'
        ).length;
        
        setStats({
          todayOrders: todayOrders.length,
          todayRevenue,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          completedOrders,
        });
      }
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const StatCard = ({ icon, title, value, color, subtitle }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
        <Ionicons name="stats-chart" size={24} color={COLORS.dark} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          
          <StatCard
            icon="calendar"
            title="Today's Orders"
            value={stats.todayOrders}
            color={COLORS.primary}
            subtitle="Orders received today"
          />
          
          <StatCard
            icon="cash"
            title="Today's Revenue"
            value={`Rs ${stats.todayRevenue.toFixed(2)}`}
            color={COLORS.success}
            subtitle="Total earnings today"
          />
          
          <Text style={styles.sectionTitle}>Overall Statistics</Text>
          
          <StatCard
            icon="receipt"
            title="Total Orders"
            value={stats.totalOrders}
            color={COLORS.primary}
            subtitle="All time orders"
          />
          
          <StatCard
            icon="wallet"
            title="Total Revenue"
            value={`Rs ${stats.totalRevenue.toFixed(2)}`}
            color={COLORS.success}
            subtitle="All time earnings"
          />
          
          <StatCard
            icon="time"
            title="Pending Orders"
            value={stats.pendingOrders}
            color={COLORS.warning}
            subtitle="Orders in progress"
          />
          
          <StatCard
            icon="checkmark-circle"
            title="Completed Orders"
            value={stats.completedOrders}
            color={COLORS.success}
            subtitle="Successfully delivered"
          />
        </ScrollView>
      )}
      
      <RestaurantBottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center', 
    backgroundColor: COLORS.white,
    elevation: 2
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark },
  loader: { marginTop: 50 },
  content: { flex: 1, padding: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 10,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderLeftWidth: 4,
  },
  statIcon: {
    marginRight: 15,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
});
