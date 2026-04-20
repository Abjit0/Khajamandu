import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { client } from '../../api/client';

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

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const orderId = params.orderId as string;

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      // Set up polling for real-time updates every 10 seconds
      const interval = setInterval(fetchOrderDetails, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await client.get(`/orders/${orderId}`);
      if (response.data.status === 'SUCCESS') {
        setOrder(response.data.data);
      }
    } catch (error: any) {
      // Silent error handling
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderDetails();
  };

  const getStatusProgress = (status: string) => {
    const statuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return statuses.indexOf(status) + 1;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED': return COLORS.warning;
      case 'CONFIRMED': return COLORS.primary;
      case 'PREPARING': return COLORS.warning;
      case 'READY': return COLORS.success;
      case 'OUT_FOR_DELIVERY': return COLORS.primary;
      case 'DELIVERED': return COLORS.success;
      case 'CANCELLED': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLACED': return 'receipt-outline';
      case 'CONFIRMED': return 'checkmark-circle-outline';
      case 'PREPARING': return 'restaurant-outline';
      case 'READY': return 'bag-check-outline';
      case 'OUT_FOR_DELIVERY': return 'bicycle-outline';
      case 'DELIVERED': return 'checkmark-done-circle';
      case 'CANCELLED': return 'close-circle-outline';
      default: return 'time-outline';
    }
  };

  const getEstimatedTime = () => {
    if (!order) return '';
    
    if (order.estimatedDeliveryTime) {
      const estimatedTime = new Date(order.estimatedDeliveryTime);
      return estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Calculate estimated time based on status
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const elapsed = (now.getTime() - orderTime.getTime()) / (1000 * 60); // minutes
    
    switch (order.orderStatus) {
      case 'PLACED':
      case 'CONFIRMED':
        return `${Math.max(0, 35 - elapsed).toFixed(0)} min`;
      case 'PREPARING':
        return `${Math.max(0, 25 - elapsed).toFixed(0)} min`;
      case 'READY':
        return `${Math.max(0, 15 - elapsed).toFixed(0)} min`;
      case 'OUT_FOR_DELIVERY':
        return `${Math.max(0, 10 - elapsed).toFixed(0)} min`;
      default:
        return 'Delivered';
    }
  };

  const renderStatusTimeline = () => {
    const statuses = [
      { key: 'PLACED', label: 'Order Placed', time: order?.createdAt },
      { key: 'CONFIRMED', label: 'Confirmed', time: order?.confirmedAt },
      { key: 'PREPARING', label: 'Preparing', time: order?.preparedAt },
      { key: 'READY', label: 'Ready for Pickup', time: null },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', time: null },
      { key: 'DELIVERED', label: 'Delivered', time: order?.deliveredAt }
    ];

    const currentStatusIndex = statuses.findIndex(s => s.key === order?.orderStatus);
    const isCancelled = order?.orderStatus === 'CANCELLED';

    return (
      <View style={styles.timeline}>
        {statuses.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const isDelivered = order?.orderStatus === 'DELIVERED' && status.key === 'DELIVERED';

          // For cancelled orders — only show PLACED as done, rest as cancelled
          if (isCancelled) {
            const isPlaced = status.key === 'PLACED';
            return (
              <View key={status.key} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineIcon,
                    isPlaced ? styles.completedIcon : styles.cancelledIcon
                  ]}>
                    <Ionicons
                      name={isPlaced ? 'checkmark' : 'close'}
                      size={16}
                      color={COLORS.white}
                    />
                  </View>
                  {index < statuses.length - 1 && (
                    <View style={[styles.timelineLine, styles.pendingLine]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, isPlaced && styles.completedLabel]}>
                    {status.label}
                  </Text>
                  {isPlaced && status.time && (
                    <Text style={styles.timelineTime}>
                      {new Date(status.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  )}
                  {!isPlaced && (
                    <Text style={styles.cancelledStatus}>Cancelled</Text>
                  )}
                </View>
              </View>
            );
          }

          return (
            <View key={status.key} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineIcon,
                  isCompleted ? styles.completedIcon : styles.pendingIcon,
                  isCurrent && !isDelivered && styles.currentIcon
                ]}>
                  <Ionicons
                    name={isCompleted ? 'checkmark' : 'time-outline'}
                    size={16}
                    color={isCompleted ? COLORS.white : COLORS.gray}
                  />
                </View>
                {index < statuses.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    isCompleted ? styles.completedLine : styles.pendingLine
                  ]} />
                )}
              </View>

              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineLabel,
                  isCompleted && styles.completedLabel,
                  isCurrent && !isDelivered && styles.currentLabel
                ]}>
                  {status.label}
                </Text>

                {/* Show timestamp if available */}
                {status.time && (
                  <Text style={styles.timelineTime}>
                    {new Date(status.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                )}

                {/* Show "In Progress" only for non-delivered current steps */}
                {isCurrent && !isDelivered && !status.time && (
                  <Text style={styles.currentStatus}>In Progress...</Text>
                )}

                {/* Show delivered confirmation */}
                {isDelivered && (
                  <Text style={styles.deliveredStatus}>✓ Order Delivered</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.error} />
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <Text style={styles.errorSubtitle}>The order you're looking for doesn't exist or has been removed.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: getStatusColor(order.orderStatus) }]}>
              <Ionicons name={getStatusIcon(order.orderStatus) as any} size={30} color={COLORS.white} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{order.orderStatus.replace('_', ' ')}</Text>
              <Text style={styles.statusSubtitle}>Order #{order._id.slice(-6)}</Text>
            </View>
          </View>
          
          {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
            <View style={styles.estimatedTime}>
              <Ionicons name="time-outline" size={16} color={COLORS.gray} />
              <Text style={styles.estimatedTimeText}>
                Estimated delivery: {getEstimatedTime()}
              </Text>
            </View>
          )}
        </View>

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Restaurant</Text>
            <Text style={styles.detailValue}>{order.restaurantName || order.restaurantId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Time</Text>
            <Text style={styles.detailValue}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{order.paymentMethod}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery Address</Text>
            <Text style={styles.detailValue}>{order.deliveryAddress}</Text>
          </View>
          
          {order.specialInstructions && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Special Instructions</Text>
              <Text style={styles.detailValue}>{order.specialInstructions}</Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.orderItems}>
          <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
          {order.items.map((item: any, index: number) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>Qty: {item.qty} × Rs {item.price}</Text>
              <Text style={styles.itemTotal}>Rs {item.qty * item.price}</Text>
            </View>
          ))}
          
          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs {order.totalAmount}</Text>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          {renderStatusTimeline()}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {order.orderStatus === 'DELIVERED' && (
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="star-outline" size={20} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Rate Order</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
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
  
  content: { flex: 1, padding: 20 },
  
  statusCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  statusInfo: { flex: 1 },
  statusTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  statusSubtitle: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    padding: 10,
    borderRadius: 8
  },
  estimatedTimeText: { marginLeft: 8, fontSize: 14, color: COLORS.dark },
  
  orderDetails: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark, marginBottom: 15 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg
  },
  detailLabel: { fontSize: 14, color: COLORS.gray, flex: 1 },
  detailValue: { fontSize: 14, color: COLORS.dark, flex: 2, textAlign: 'right' },
  
  orderItems: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg
  },
  itemName: { flex: 2, fontSize: 14, fontWeight: 'bold', color: COLORS.dark },
  itemDetails: { flex: 2, fontSize: 12, color: COLORS.gray, textAlign: 'center' },
  itemTotal: { flex: 1, fontSize: 14, fontWeight: 'bold', color: COLORS.primary, textAlign: 'right' },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  
  timelineContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2
  },
  timeline: { marginTop: 10 },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 15
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  completedIcon: { backgroundColor: COLORS.success },
  currentIcon: { backgroundColor: COLORS.primary },
  pendingIcon: { backgroundColor: COLORS.gray },
  cancelledIcon: { backgroundColor: COLORS.error },
  timelineLine: {
    width: 2,
    height: 30,
    marginTop: 5
  },
  completedLine: { backgroundColor: COLORS.success },
  pendingLine: { backgroundColor: COLORS.gray },
  timelineContent: { flex: 1, paddingTop: 5 },
  timelineLabel: { fontSize: 14, color: COLORS.gray },
  completedLabel: { color: COLORS.dark, fontWeight: '500' },
  currentLabel: { color: COLORS.primary, fontWeight: 'bold' },
  timelineTime: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  currentStatus: { fontSize: 12, color: COLORS.primary, marginTop: 2, fontStyle: 'italic' },
  deliveredStatus: { fontSize: 12, color: COLORS.success, marginTop: 2, fontWeight: 'bold' },
  cancelledStatus: { fontSize: 12, color: COLORS.error, marginTop: 2, fontStyle: 'italic' },
  
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    minWidth: 120,
    justifyContent: 'center'
  },
  actionButtonText: { marginLeft: 8, fontSize: 14, color: COLORS.primary, fontWeight: 'bold' },
  
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark, marginTop: 20 },
  errorSubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 8 },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20
  },
  backButtonText: { color: COLORS.white, fontWeight: 'bold' }
});