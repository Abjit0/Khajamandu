import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, TextInput 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { client, authAPI } from '../../api/client';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('COD'); 
  const [loading, setLoading] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    checkAuthentication();
    if (params.data) {
      try {
        const parsedData = JSON.parse(params.data as string);
        setCartItems(parsedData);
      } catch (e: any) { 
        console.log('Error parsing cart data:', e);
        setCartItems([]);
      }
    }
  }, [params.data]);

  const checkAuthentication = async () => {
    const isAuth = await authAPI.isAuthenticated();
    setUserAuthenticated(isAuth);
    
    if (!isAuth) {
      Alert.alert(
        'Login Required',
        'Please login to place an order',
        [
          { text: 'Cancel', onPress: () => router.back() },
          { text: 'Login', onPress: () => router.replace('/') }
        ]
      );
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!userAuthenticated) {
      Alert.alert('Error', 'Please login to place an order');
      return;
    }

    // Get user data for the order
    const authData = await authAPI.getAuthData();
    let currentUser = null;
    if (authData.userData) {
      try {
        currentUser = typeof authData.userData === 'string' 
          ? JSON.parse(authData.userData) 
          : authData.userData;
      } catch (error: any) {
        // Silent error handling
      }
    }

    // Ensure items have proper structure
    const processedItems = cartItems.map((item, index) => ({
      id: item.id || `item-${index}`,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty)
    }));

    // Get restaurant info from cart items (assuming all items are from same restaurant)
    const restaurantInfo = cartItems[0]?.restaurant || 'Unknown Restaurant';
    
    const orderData = {
        items: processedItems,
        totalAmount: Number(total),
        deliveryAddress: "Kathmandu, Nepal",
        restaurantId: restaurantInfo,
        restaurantName: restaurantInfo,
        paymentMethod: paymentMethod,
        specialInstructions: specialInstructions.trim() || '',
        // Add logged-in user details
        userEmail: currentUser?.email || 'guest@khajamandu.com',
        userId: currentUser?.id || 'guest-user',
        customerName: currentUser?.profile?.name || 'Guest Customer',
        customerPhone: currentUser?.profile?.phone || ''
    };

    console.log('🛒 Placing order with data:', JSON.stringify(orderData, null, 2));

    if (paymentMethod === 'Khalti' || paymentMethod === 'eSewa') {
        router.push({
            pathname: '/customer/payment-gateway',
            params: {
                provider: paymentMethod,
                totalAmount: total,
                orderData: JSON.stringify(orderData) 
            }
        } as any);
    } else {
        // Cash on Delivery
        setLoading(true);
        try {
            const response = await client.post('/orders/create', orderData);
            
            if (response.data.status === 'SUCCESS') {
                const orderId = response.data.data.orderId;
                Alert.alert(
                    'Order Placed Successfully!', 
                    `Your order has been placed. Order ID: #${orderId.slice(-6)}\n\nYou will receive notifications about your order status.`,
                    [{ 
                      text: 'Track Order', 
                      onPress: () => router.replace({
                        pathname: '/customer/order-success',
                        params: { orderId: orderId }
                      } as any)
                    }]
                );
            } else {
                Alert.alert('Error', response.data.message || 'Failed to place order');
            }
        } catch (error: any) {
            if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
                Alert.alert('Connection Error', 'Could not connect to server. Please check your internet connection.');
            } else if (error.response?.status === 401) {
                Alert.alert('Authentication Error', 'Please login again');
                router.replace('/');
            } else if (error.response?.status === 400) {
                const errorMsg = error.response.data.errors 
                    ? error.response.data.errors.join(', ')
                    : error.response.data.message || 'Invalid order data';
                Alert.alert('Order Error', errorMsg);
            } else {
                Alert.alert('Error', 'Failed to place order. Please try again.');
            }
        }
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({cartItems.length})</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>Qty: {item.qty} × Rs {item.price}</Text>
              <Text style={styles.itemTotal}>Rs {item.qty * item.price}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
                <Ionicons name="location" size={24} color={COLORS.primary} style={{marginRight: 10}}/>
                <Text style={{flex:1, fontWeight:'bold'}}>Kathmandu, Nepal</Text>
            </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <PaymentOption 
              name="Cash on Delivery" 
              icon="cash-outline" 
              selected={paymentMethod === 'COD'} 
              onPress={() => setPaymentMethod('COD')} 
            />
            <PaymentOption 
              name="Khalti" 
              image="https://upload.wikimedia.org/wikipedia/commons/e/ee/Khalti_Digital_Wallet_Logo.png.jpg" 
              selected={paymentMethod === 'Khalti'} 
              onPress={() => setPaymentMethod('Khalti')} 
            />
            <PaymentOption 
              name="eSewa" 
              image="https://cdn.esewa.com.np/ui/images/esewa_og.png?111" 
              selected={paymentMethod === 'eSewa'} 
              onPress={() => setPaymentMethod('eSewa')} 
            />
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Any special requests? (e.g., no spice, extra sauce, etc.)"
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            <Text style={styles.characterCount}>{specialInstructions.length}/200</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>Rs {subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>Rs {deliveryFee}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rs {total}</Text>
              </View>
            </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.payButton, (!userAuthenticated || loading) && styles.disabledButton]} 
          onPress={handlePlaceOrder} 
          disabled={!userAuthenticated || loading}
        >
            {loading ? (
              <ActivityIndicator color="white"/>
            ) : (
              <Text style={styles.payButtonText}>
                {paymentMethod === 'COD' ? 'Place Order' : `Pay Rs ${total}`}
              </Text>
            )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PaymentOption = ({ name, icon, image, selected, onPress }: any) => (
    <TouchableOpacity style={[styles.paymentOption, selected && styles.selectedOption]} onPress={onPress}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 24, height: 24, borderRadius: 4 }} />
        ) : (
          <Ionicons name={icon} size={24} color={COLORS.dark} />
        )}
        <Text style={styles.paymentText}>{name}</Text>
        <View style={styles.radio}>
          {selected && <View style={styles.radioSelected} />}
        </View>
    </TouchableOpacity>
);

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
  scrollContent: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: COLORS.dark },
  
  orderItem: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemName: { flex: 2, fontWeight: 'bold', color: COLORS.dark },
  itemDetails: { flex: 2, fontSize: 12, color: COLORS.gray },
  itemTotal: { flex: 1, textAlign: 'right', fontWeight: 'bold', color: COLORS.primary },
  
  addressCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: 15, 
    borderRadius: 12,
    elevation: 1
  },
  
  paymentOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: 'transparent',
    elevation: 1
  },
  selectedOption: { borderColor: COLORS.primary, backgroundColor: '#FFF0E6' },
  paymentText: { flex: 1, marginLeft: 10, fontWeight: '600', color: COLORS.dark },
  radio: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: COLORS.gray, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioSelected: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 1
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: COLORS.gray },
  summaryValue: { fontSize: 14, color: COLORS.dark },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.bg,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  
  instructionsInput: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.gray + '30',
    elevation: 1
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 5
  },
  
  footer: { padding: 20, backgroundColor: COLORS.white, elevation: 5 },
  payButton: { 
    backgroundColor: COLORS.primary, 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    elevation: 2
  },
  disabledButton: { backgroundColor: COLORS.gray, opacity: 0.6 },
  payButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});