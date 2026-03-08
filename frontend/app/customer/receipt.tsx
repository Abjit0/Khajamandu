import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert 
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
  success: '#4CAF50'
};

export default function ReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = params.orderId as string;

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await client.get(`/orders/${orderId}`);
      if (response.data.status === 'SUCCESS') {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching order:', error);
      Alert.alert('Error', 'Failed to load receipt details');
    }
    setLoading(false);
  };

  const generateReceiptNumber = () => {
    if (!order) return '';
    const date = new Date(order.createdAt);
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `KM${dateStr}${order._id.slice(-4).toUpperCase()}`;
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
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.gray} />
          <Text style={styles.errorTitle}>Receipt Not Found</Text>
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
        <Text style={styles.headerTitle}>Receipt</Text>
        <TouchableOpacity onPress={() => Alert.alert('Download', 'Receipt download feature coming soon!')}>
          <Ionicons name="download-outline" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.receipt}>
          {/* Header */}
          <View style={styles.receiptHeader}>
            <Text style={styles.companyName}>Khajamandu</Text>
            <Text style={styles.companyTagline}>Food Delivery Service</Text>
            <Text style={styles.companyAddress}>Kathmandu, Nepal</Text>
          </View>

          {/* Receipt Info */}
          <View style={styles.receiptInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receipt #:</Text>
              <Text style={styles.infoValue}>{generateReceiptNumber()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order #:</Text>
              <Text style={styles.infoValue}>{order._id.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.customerName}>{order.customerName || 'Guest Customer'}</Text>
            <Text style={styles.customerEmail}>{order.userEmail}</Text>
            <Text style={styles.customerAddress}>{order.deliveryAddress}</Text>
          </View>

          {/* Restaurant Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurant</Text>
            <Text style={styles.restaurantName}>{order.restaurantName || order.restaurantId}</Text>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <View style={styles.itemsHeader}>
              <Text style={styles.itemHeaderText}>Item</Text>
              <Text style={styles.itemHeaderText}>Qty</Text>
              <Text style={styles.itemHeaderText}>Price</Text>
              <Text style={styles.itemHeaderText}>Total</Text>
            </View>
            
            {order.items.map((item: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.qty}</Text>
                <Text style={styles.itemPrice}>Rs {item.price}</Text>
                <Text style={styles.itemTotal}>Rs {item.qty * item.price}</Text>
              </View>
            ))}
          </View>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <Text style={styles.instructions}>{order.specialInstructions}</Text>
            </View>
          )}

          {/* Payment Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                Rs {order.items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>Rs 50</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax & Fees</Text>
              <Text style={styles.summaryValue}>Rs 0</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>Rs {order.totalAmount}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method</Text>
              <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Status</Text>
              <Text style={[
                styles.summaryValue,
                order.paymentStatus === 'PAID' ? styles.paidStatus : styles.pendingStatus
              ]}>
                {order.paymentStatus}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.receiptFooter}>
            <Text style={styles.footerText}>Thank you for choosing Khajamandu!</Text>
            <Text style={styles.footerSubtext}>
              For support, contact us at support@khajamandu.com
            </Text>
            <Text style={styles.footerSubtext}>
              Order Status: {order.orderStatus.replace('_', ' ')}
            </Text>
          </View>

          {/* QR Code Placeholder */}
          <View style={styles.qrSection}>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code-outline" size={40} color={COLORS.gray} />
              <Text style={styles.qrText}>Scan for order tracking</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push({
            pathname: '/customer/order-tracking',
            params: { orderId: order._id }
          } as any)}
        >
          <Ionicons name="location-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Track Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Share', 'Share receipt feature coming soon!')}
        >
          <Ionicons name="share-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
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
  
  receipt: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    elevation: 3,
    marginBottom: 20
  },
  
  receiptHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: 20
  },
  companyName: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  companyTagline: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  companyAddress: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  
  receiptInfo: { marginBottom: 20 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  infoLabel: { fontSize: 14, color: COLORS.gray },
  infoValue: { fontSize: 14, color: COLORS.dark, fontWeight: '500' },
  
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.dark, 
    marginBottom: 10 
  },
  
  customerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  customerEmail: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  customerAddress: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  
  itemsHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    marginBottom: 8
  },
  itemHeaderText: { 
    flex: 1, 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: COLORS.gray,
    textAlign: 'center'
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    alignItems: 'center'
  },
  itemName: { flex: 1, fontSize: 14, color: COLORS.dark },
  itemQty: { flex: 1, fontSize: 14, color: COLORS.dark, textAlign: 'center' },
  itemPrice: { flex: 1, fontSize: 14, color: COLORS.dark, textAlign: 'center' },
  itemTotal: { flex: 1, fontSize: 14, fontWeight: 'bold', color: COLORS.dark, textAlign: 'center' },
  
  instructions: { fontSize: 14, color: COLORS.dark, fontStyle: 'italic' },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  summaryLabel: { fontSize: 14, color: COLORS.gray },
  summaryValue: { fontSize: 14, color: COLORS.dark },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    paddingTop: 8,
    marginTop: 8
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  paidStatus: { color: COLORS.success, fontWeight: 'bold' },
  pendingStatus: { color: COLORS.primary, fontWeight: 'bold' },
  
  receiptFooter: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.bg
  },
  footerText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  footerSubtext: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  
  qrSection: {
    alignItems: 'center',
    marginTop: 20
  },
  qrPlaceholder: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrText: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
  
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: COLORS.white,
    elevation: 5
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    padding: 15,
    borderRadius: 12,
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
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20
  },
  backButtonText: { color: COLORS.white, fontWeight: 'bold' }
});