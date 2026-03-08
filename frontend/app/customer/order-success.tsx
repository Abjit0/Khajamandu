import React from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
  success: '#4CAF50'
};

export default function OrderSuccessEnhanced() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const orderId = params.orderId as string;

  // Removed auto-redirect timer so buttons stay visible

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with Close Button */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.replace('/customer/home')}
        >
          <Ionicons name="close" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Success Animation/Icon */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Thank you for your order. We'll prepare your delicious food with care.
        </Text>

        {orderId && (
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderId}>#{orderId.slice(-6)}</Text>
          </View>
        )}

        {/* Estimated Time */}
        <View style={styles.timeInfo}>
          <Ionicons name="time-outline" size={24} color={COLORS.primary} />
          <Text style={styles.timeText}>Estimated delivery: 30-45 minutes</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {orderId && (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push(`/customer/order-tracking?orderId=${orderId}` as any)}
            >
              <Ionicons name="location-outline" size={20} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Track Order</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.replace('/customer/home')}
          >
            <Ionicons name="home-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>View Orders</Text>
          </TouchableOpacity>

          {orderId && (
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push({
                pathname: '/customer/receipt',
                params: { orderId }
              } as any)}
            >
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>View Receipt</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>Your payment is secure</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>You'll receive updates via notifications</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>Need help? Contact support</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  
  successIcon: {
    marginBottom: 30,
    alignItems: 'center'
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22
  },
  
  orderInfo: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    minWidth: 200
  },
  orderLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 2
  },
  timeText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '500'
  },
  
  buttonContainer: {
    width: '100%',
    marginBottom: 30
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  primaryButton: {
    backgroundColor: COLORS.primary
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  
  infoContainer: {
    width: '100%'
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.gray
  }
});