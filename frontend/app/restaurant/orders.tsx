import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import RestaurantBottomNavBar from '../../components/RestaurantBottomNavBar';
import { client, authAPI } from '../../api/client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#E6753A', bg: '#F8F4E9', white: '#FFFFFF',
  dark: '#2D2D2D', gray: '#8A8A8A',
  success: '#4CAF50', warning: '#FF9800', error: '#F44336'
};

export default function RestaurantOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [preOrders, setPreOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeView, setActiveView] = useState<'regular' | 'preorder'>('regular');

  useEffect(() => {
    checkUserRole();
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkUserRole = async () => {
    try {
      const authData = await authAPI.getAuthData();
      if (authData.userData) {
        const userData = typeof authData.userData === 'string'
          ? JSON.parse(authData.userData) : authData.userData;
        if (userData.role !== 'restaurant') {
          Alert.alert('Access Denied', 'This page is only for restaurant owners', [
            { text: 'OK', onPress: () => router.replace('/customer/home') }
          ]);
        }
      }
    } catch (error) { console.log('Error checking user role:', error); }
  };

  const fetchOrders = async () => {
    try {
      const response = await client.get('/orders/all');
      if (response.data.status === 'SUCCESS') setOrders(response.data.data);
      const preRes = await client.get('/orders/preorders/list');
      if (preRes.data.status === 'SUCCESS') setPreOrders(preRes.data.data);
    } catch (error: any) {
      console.log('Error fetching orders:', error.response?.data || error.message);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const isAuth = await authAPI.isAuthenticated();
      if (!isAuth) { Alert.alert('Authentication Error', 'Please login'); return; }
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      const response = await client.post('/orders/update-status', { orderId, status });
      if (response.data.status === 'SUCCESS') {
        const msgs: Record<string, string> = {
          CONFIRMED: '✅ Order accepted!', PREPARING: '👨‍🍳 Preparing!',
          READY: '🍽️ Ready for pickup!', OUT_FOR_DELIVERY: '🚴 Out for delivery!',
          DELIVERED: '🎉 Delivered!', CANCELLED: '❌ Cancelled.'
        };
        Alert.alert('Updated', msgs[status] || 'Status updated');
        setTimeout(fetchOrders, 1000);
      } else { fetchOrders(); Alert.alert('Error', 'Failed to update'); }
    } catch (error: any) {
      fetchOrders();
      if (error.response?.status === 401) { Alert.alert('Auth Error', 'Please login again'); }
      else Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getStatusStyle = (status: string) => {
    const map: Record<string, string> = {
      PLACED: COLORS.warning, CONFIRMED: COLORS.primary, PREPARING: COLORS.warning,
      READY: COLORS.success, DELIVERED: COLORS.success, CANCELLED: COLORS.error
    };
    return { color: map[status] || COLORS.gray };
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders : orders.filter(o => o.orderStatus === filterStatus);

  const statusFilters = [
    { label: 'All', value: 'ALL' }, { label: 'New', value: 'PLACED' },
    { label: 'Cooking', value: 'PREPARING' }, { label: 'Ready', value: 'READY' },
    { label: 'Done', value: 'DELIVERED' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity onPress={fetchOrders}>
          <Ionicons name="refresh" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeView === 'regular' && styles.toggleActive]}
          onPress={() => setActiveView('regular')}
        >
          <Text style={[styles.toggleText, activeView === 'regular' && styles.toggleTextActive]}>
            Live Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, activeView === 'preorder' && styles.toggleActive]}
          onPress={() => setActiveView('preorder')}
        >
          <Text style={[styles.toggleText, activeView === 'preorder' && styles.toggleTextActive]}>
            📅 Pre-Orders{preOrders.length > 0 ? ` (${preOrders.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {activeView === 'preorder' ? (
        /* PRE-ORDERS VIEW */
        <ScrollView style={styles.ordersList}>
          {preOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={60} color={COLORS.gray} />
              <Text style={styles.emptyTitle}>No Pre-Orders</Text>
              <Text style={styles.emptySubtitle}>Scheduled orders will appear here</Text>
            </View>
          ) : preOrders.map((order: any) => (
            <View key={order._id} style={[styles.orderCard, styles.preOrderCard]}>
              <View style={styles.preOrderBadge}>
                <Ionicons name="time" size={12} color={COLORS.white} />
                <Text style={styles.preOrderBadgeText}>PRE-ORDER</Text>
              </View>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
                <Text style={styles.orderAmount}>Rs {order.totalAmount}</Text>
              </View>
              <View style={styles.scheduledTimeBox}>
                <Ionicons name="alarm-outline" size={16} color={COLORS.primary} />
                <Text style={styles.scheduledTimeText}>
                  {new Date(order.scheduledTime).toLocaleString([], {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={styles.orderItems}>
                {order.items.map((item: any, i: number) => (
                  <Text key={i} style={styles.orderItem}>{item.qty}x {item.name}</Text>
                ))}
              </View>
              <View style={styles.orderMeta}>
                <Text style={styles.orderCustomer}>👤 {order.customerName || 'Guest'}</Text>
                <Text style={[styles.orderStatus, { color: COLORS.primary }]}>{order.preOrderStatus}</Text>
              </View>
              {order.orderStatus === 'PLACED' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton, { marginTop: 8, alignSelf: 'stretch', justifyContent: 'center' }]}
                  onPress={() => updateOrderStatus(order._id, 'CONFIRMED')}
                >
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Confirm Pre-Order</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        /* LIVE ORDERS VIEW */
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.filterContainer} contentContainerStyle={styles.filterContentContainer}>
            {statusFilters.map((filter) => (
              <TouchableOpacity key={filter.value}
                style={[styles.filterChip, filterStatus === filter.value && styles.activeFilterChip]}
                onPress={() => setFilterStatus(filter.value)}>
                <Text style={[styles.filterText, filterStatus === filter.value && styles.activeFilterText]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : (
            <ScrollView style={styles.ordersList}>
              {filteredOrders.map((order: any) => (
                <View key={order._id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
                    <Text style={styles.orderAmount}>Rs {order.totalAmount}</Text>
                  </View>
                  <View style={styles.orderItems}>
                    {order.items.map((item: any, index: number) => (
                      <Text key={index} style={styles.orderItem}>{item.qty}x {item.name}</Text>
                    ))}
                  </View>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderCustomer}>👤 {order.customerName || 'Guest'}</Text>
                    <Text style={styles.orderTime}>🕒 {new Date(order.createdAt).toLocaleTimeString()}</Text>
                  </View>
                  <View style={styles.orderActions}>
                    <Text style={[styles.orderStatus, getStatusStyle(order.orderStatus)]}>{order.orderStatus}</Text>
                    {order.orderStatus === 'PLACED' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => updateOrderStatus(order._id, 'CONFIRMED')}>
                          <Ionicons name="checkmark" size={16} color={COLORS.white} />
                          <Text style={styles.actionButtonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => updateOrderStatus(order._id, 'CANCELLED')}>
                          <Ionicons name="close" size={16} color={COLORS.white} />
                          <Text style={styles.actionButtonText}>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {order.orderStatus === 'CONFIRMED' && (
                      <TouchableOpacity style={[styles.actionButton, styles.preparingButton]} onPress={() => updateOrderStatus(order._id, 'PREPARING')}>
                        <Ionicons name="restaurant" size={16} color={COLORS.white} />
                        <Text style={styles.actionButtonText}>Start Preparing</Text>
                      </TouchableOpacity>
                    )}
                    {order.orderStatus === 'PREPARING' && (
                      <TouchableOpacity style={[styles.actionButton, styles.readyButton]} onPress={() => updateOrderStatus(order._id, 'READY')}>
                        <Ionicons name="checkmark-done" size={16} color={COLORS.white} />
                        <Text style={styles.actionButtonText}>Ready for Pickup</Text>
                      </TouchableOpacity>
                    )}
                    {order.orderStatus === 'READY' && (
                      <TouchableOpacity style={[styles.actionButton, styles.deliveryButton]} onPress={() => updateOrderStatus(order._id, 'OUT_FOR_DELIVERY')}>
                        <Ionicons name="bicycle" size={16} color={COLORS.white} />
                        <Text style={styles.actionButtonText}>Out for Delivery</Text>
                      </TouchableOpacity>
                    )}
                    {order.orderStatus === 'OUT_FOR_DELIVERY' && (
                      <TouchableOpacity style={[styles.actionButton, styles.deliveredButton]} onPress={() => updateOrderStatus(order._id, 'DELIVERED')}>
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                        <Text style={styles.actionButtonText}>Mark Delivered</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
              {filteredOrders.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="receipt-outline" size={60} color={COLORS.gray} />
                  <Text style={styles.emptyTitle}>No orders</Text>
                  <Text style={styles.emptySubtitle}>
                    {filterStatus === 'ALL' ? 'Orders will appear here when customers place them' : `No ${filterStatus.toLowerCase()} orders`}
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </>
      )}

      <RestaurantBottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', backgroundColor: COLORS.white, elevation: 2 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark },

  viewToggle: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 8, paddingHorizontal: 16, gap: 8 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center', backgroundColor: '#F0F0F0' },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 13, fontWeight: '600', color: COLORS.gray },
  toggleTextActive: { color: COLORS.white },

  filterContainer: { backgroundColor: COLORS.white, paddingVertical: 12, maxHeight: 60 },
  filterContentContainer: { paddingHorizontal: 15, paddingRight: 30, alignItems: 'center' },
  filterChip: { backgroundColor: COLORS.bg, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: COLORS.gray, minWidth: 75, alignItems: 'center', height: 40 },
  activeFilterChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, color: COLORS.dark, fontWeight: '500' },
  activeFilterText: { color: COLORS.white, fontWeight: 'bold' },

  loader: { marginTop: 50 },
  ordersList: { flex: 1, padding: 15 },
  orderCard: { backgroundColor: COLORS.white, padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2, width: SCREEN_WIDTH - 30, alignSelf: 'center' },
  preOrderCard: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  preOrderBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginBottom: 8, gap: 4 },
  preOrderBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  scheduledTimeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E6', padding: 8, borderRadius: 8, marginBottom: 10, gap: 6 },
  scheduledTimeText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 14, fontWeight: 'bold', color: COLORS.dark },
  orderAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  orderItems: { marginBottom: 8 },
  orderItem: { fontSize: 14, color: COLORS.dark, marginBottom: 2 },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderCustomer: { fontSize: 12, color: COLORS.gray },
  orderTime: { fontSize: 12, color: COLORS.gray },
  orderActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', width: '100%' },
  orderStatus: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  actionButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1 },
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, marginLeft: 6, marginTop: 4, minWidth: 80, justifyContent: 'center' },
  acceptButton: { backgroundColor: COLORS.success },
  rejectButton: { backgroundColor: COLORS.error },
  preparingButton: { backgroundColor: COLORS.warning },
  readyButton: { backgroundColor: COLORS.success },
  deliveryButton: { backgroundColor: COLORS.primary },
  deliveredButton: { backgroundColor: COLORS.success },
  actionButtonText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark, marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 5 },
});

// updated: 2026-04-27T12:30:00
