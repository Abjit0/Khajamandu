import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import RestaurantBottomNavBar from '../components/RestaurantBottomNavBar';
import { client, authAPI } from '../api/client';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336'
};

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
    if (activeTab === 'orders') {
      fetchUserOrders();
    } else if (activeTab === 'transactions') {
      fetchTransactionHistory();
    }
  }, [activeTab]);

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
      console.log('Error loading user data:', error);
      // Clear corrupted data
      try {
        await authAPI.clearAuthData();
      } catch (clearError) {
        console.log('Error clearing corrupted data:', clearError);
      }
    }
    setLoading(false);
  };

  const fetchUserOrders = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const response = await client.get(`/orders/user/${userData.id}`);
      if (response.data.status === 'SUCCESS') {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const fetchTransactionHistory = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const response = await client.get(`/transactions/${userData.id}`);
      if (response.data.status === 'SUCCESS') {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authAPI.clearAuthData();
            router.replace('/');
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED': return COLORS.warning;
      case 'CONFIRMED': return COLORS.primary;
      case 'PREPARING': return COLORS.warning;
      case 'READY': return COLORS.success;
      case 'DELIVERED': return COLORS.success;
      case 'CANCELLED': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const renderProfileTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={COLORS.white} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.profile?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{userData?.email}</Text>
            <View style={styles.roleContainer}>
              <Text style={[styles.roleText, getRoleStyle(userData?.role)]}>
                {userData?.role?.toUpperCase() || 'CUSTOMER'}
              </Text>
            </View>
          </View>
        </View>
        
        {userData?.profile?.phone && (
          <View style={styles.contactInfo}>
            <Ionicons name="call" size={16} color={COLORS.gray} />
            <Text style={styles.contactText}>{userData.profile.phone}</Text>
          </View>
        )}
        
        {userData?.profile?.address && (
          <View style={styles.contactInfo}>
            <Ionicons name="location" size={16} color={COLORS.gray} />
            <Text style={styles.contactText}>{userData.profile.address}</Text>
          </View>
        )}
      </View>

      {/* Restaurant Info (if user is restaurant) */}
      {userData?.role === 'restaurant' && (
        <View style={styles.restaurantCard}>
          <Text style={styles.cardTitle}>Restaurant Information</Text>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>
              {userData.profile?.restaurantName || 'Restaurant Name Not Set'}
            </Text>
            {userData.profile?.cuisine && (
              <Text style={styles.cuisineType}>Cuisine: {userData.profile.cuisine}</Text>
            )}
            {userData.profile?.restaurantAddress && (
              <Text style={styles.restaurantAddress}>{userData.profile.restaurantAddress}</Text>
            )}
            {userData.profile?.restaurantPhone && (
              <Text style={styles.restaurantPhone}>📞 {userData.profile.restaurantPhone}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.dashboardButton}
            onPress={() => router.push('/restaurant/dashboard')}
          >
            <Ionicons name="restaurant" size={20} color={COLORS.white} />
            <Text style={styles.dashboardButtonText}>Manage Restaurant</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color={COLORS.primary} />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderOrdersTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Order History ({orders.length})</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <>
          {orders.map((order: any) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.orderStatus) }]}>
                  {order.orderStatus}
                </Text>
              </View>
              
              <View style={styles.orderDetails}>
                <Text style={styles.orderRestaurant}>{order.restaurantName || order.restaurantId}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </Text>
              </View>
              
              <View style={styles.orderItems}>
                {order.items.slice(0, 2).map((item: any, index: number) => (
                  <Text key={index} style={styles.orderItem}>
                    {item.qty}x {item.name}
                  </Text>
                ))}
                {order.items.length > 2 && (
                  <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
                )}
              </View>
              
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>Rs {order.totalAmount}</Text>
                <TouchableOpacity style={styles.reorderButton}>
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {orders.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color={COLORS.gray} />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>Start ordering to see your history here</Text>
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.replace('/customer/home')}
              >
                <Text style={styles.browseButtonText}>Browse Restaurants</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );

  const renderTransactionsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Transaction History ({transactions.length})</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <>
          {transactions.map((transaction: any) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name={transaction.paymentMethod === 'COD' ? 'cash-outline' : 'card-outline'} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    Order Payment - {transaction.restaurant}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()} at{' '}
                    {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text style={styles.transactionMethod}>
                    via {transaction.paymentMethod}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={styles.amountText}>Rs {transaction.amount}</Text>
                  <Text style={[
                    styles.statusText,
                    transaction.status === 'PAID' ? styles.paidStatus : 
                    transaction.status === 'PENDING' ? styles.pendingStatus : styles.failedStatus
                  ]}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
              
              {transaction.transactionId && (
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionId}>
                    Transaction ID: {transaction.transactionId}
                  </Text>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.viewOrderButton}
                onPress={() => router.push({
                  pathname: '/customer/order-tracking',
                  params: { orderId: transaction.orderId }
                } as any)}
              >
                <Text style={styles.viewOrderText}>View Order Details</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))}
          
          {transactions.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={60} color={COLORS.gray} />
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtitle}>Your payment history will appear here</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'restaurant': return { backgroundColor: COLORS.primary };
      case 'rider': return { backgroundColor: COLORS.success };
      case 'admin': return { backgroundColor: COLORS.error };
      default: return { backgroundColor: COLORS.gray };
    }
  };

  if (loading && !userData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.centerLoader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons name="person" size={20} color={activeTab === 'profile' ? COLORS.primary : COLORS.gray} />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Profile</Text>
        </TouchableOpacity>
        
        {userData?.role !== 'restaurant' && (
          <>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
              onPress={() => setActiveTab('orders')}
            >
              <Ionicons name="receipt" size={20} color={activeTab === 'orders' ? COLORS.primary : COLORS.gray} />
              <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
              onPress={() => setActiveTab('transactions')}
            >
              <Ionicons name="card" size={20} color={activeTab === 'transactions' ? COLORS.primary : COLORS.gray} />
              <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Payments</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {activeTab === 'profile' ? renderProfileTab() : 
       activeTab === 'orders' ? renderOrdersTab() : 
       renderTransactionsTab()}
      
      {userData?.role === 'restaurant' ? <RestaurantBottomNavBar /> : <BottomNavBar />}
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    elevation: 1
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { marginLeft: 8, fontSize: 16, color: COLORS.gray },
  activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
  
  tabContent: { flex: 1, padding: 20 },
  
  userCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  userEmail: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  roleContainer: { marginTop: 8 },
  roleText: {
    fontSize: 10,
    color: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    fontWeight: 'bold'
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  contactText: { marginLeft: 8, fontSize: 14, color: COLORS.dark },
  
  restaurantCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark, marginBottom: 15 },
  restaurantInfo: { marginBottom: 15 },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark, marginBottom: 5 },
  cuisineType: { fontSize: 14, color: COLORS.gray, marginBottom: 5 },
  restaurantAddress: { fontSize: 14, color: COLORS.gray, marginBottom: 5 },
  restaurantPhone: { fontSize: 14, color: COLORS.gray },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center'
  },
  dashboardButtonText: { color: COLORS.white, fontWeight: 'bold', marginLeft: 8 },
  
  menuSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    elevation: 2,
    marginBottom: 20
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg
  },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: COLORS.dark },
  logoutItem: { borderBottomWidth: 0 },
  logoutText: { color: COLORS.error },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark, marginBottom: 15 },
  
  orderCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  orderId: { fontSize: 14, fontWeight: 'bold', color: COLORS.dark },
  orderStatus: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  orderDetails: { marginBottom: 8 },
  orderRestaurant: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  orderDate: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  orderItems: { marginBottom: 12 },
  orderItem: { fontSize: 14, color: COLORS.dark, marginBottom: 2 },
  moreItems: { fontSize: 12, color: COLORS.gray, fontStyle: 'italic' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  reorderButton: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  reorderText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark, marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 5 },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15
  },
  browseButtonText: { color: COLORS.white, fontWeight: 'bold' },
  
  loader: { marginTop: 50 },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Transaction styles
  transactionCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.dark },
  transactionDate: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  transactionMethod: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  transactionAmount: { alignItems: 'flex-end' },
  amountText: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  statusText: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  paidStatus: { color: COLORS.success },
  pendingStatus: { color: COLORS.warning },
  failedStatus: { color: COLORS.error },
  transactionDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.bg
  },
  transactionId: { fontSize: 12, color: COLORS.gray, fontFamily: 'monospace' },
  viewOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: COLORS.bg,
    borderRadius: 8
  },
  viewOrderText: { fontSize: 14, color: COLORS.primary, fontWeight: 'bold', marginRight: 4 }
});
