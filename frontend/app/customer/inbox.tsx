import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBarWithBadge from '../../components/BottomNavBarWithBadge';
import { client, authAPI } from '../../api/client';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

export default function InboxScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchNotifications();
      // Set up polling for notifications every 5 seconds
      const interval = setInterval(fetchNotifications, 5000);
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

  const fetchNotifications = async () => {
    if (!userData) return;
    
    const previousCount = notifications.length;
    
    try {
      const response = await client.get(`/notifications/${userData.id}`);
      if (response.data.status === 'SUCCESS') {
        const newNotifications = response.data.data;
        setNotifications(newNotifications);
        setUnreadCount(response.data.unreadCount);
        
        // Show alert if new notifications arrived
        if (newNotifications.length > previousCount && previousCount > 0) {
          Alert.alert(
            'New Notification!', 
            'You have received a new order update.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      // Silent error handling
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await client.patch(`/notifications/${notificationId}/read`);
      // Update local state
      setNotifications((prev: any[]) => 
        prev.map((notif: any) => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      // Silent error handling
    }
  };

  const handleNotificationPress = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // Navigate to order tracking if it's an order notification
    if (notification.orderId) {
      router.push({
        pathname: '/customer/order-tracking',
        params: { orderId: notification.orderId }
      } as any);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Inbox</Text>
        </View>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        <BottomNavBarWithBadge />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <View style={styles.headerRight}>
          <Text style={styles.subtitle}>{unreadCount} unread</Text>
          {refreshing && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 10 }} />}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <NotificationItem 
              key={notification._id} 
              notification={notification} 
              onPress={() => handleNotificationPress(notification)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={60} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>You'll receive updates about your orders here</Text>
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBarWithBadge />
    </SafeAreaView>
  );
}

const NotificationItem = ({ notification, onPress }: { notification: any, onPress: () => void }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'order_update': return 'restaurant-outline';
      case 'payment': return 'card-outline';
      case 'promotion': return 'gift-outline';
      case 'system': return 'information-circle-outline';
      default: return 'notifications-outline';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order_update': return COLORS.primary;
      case 'payment': return '#4CAF50';
      case 'promotion': return '#FF9800';
      case 'system': return '#2196F3';
      default: return COLORS.gray;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <TouchableOpacity 
      style={[styles.notificationItem, !notification.read && styles.unread]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor(notification.type) + '20' }]}>
        <Ionicons name={getIcon(notification.type) as any} size={24} color={getIconColor(notification.type)} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{getTimeAgo(notification.createdAt)}</Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 20, alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 20 },
  
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    elevation: 1,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: { flex: 1 },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
  
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 20,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20
  }
});