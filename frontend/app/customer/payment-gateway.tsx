import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Image, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { client } from '../../api/client';

const COLORS = {
  khalti: '#5C2D91',
  esewa: '#60BB46',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
  lightGray: '#F5F5F5'
};

export default function PaymentGatewayEnhanced() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('form'); // form, processing, success, failed
  const [paymentForm, setPaymentForm] = useState({
    mobileNumber: '',
    pin: '',
    otp: ''
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const provider = params.provider as string;
  const totalAmount = parseFloat(params.totalAmount as string);
  let orderData = null;
  
  // Get theme colors based on provider
  const isKhalti = provider === 'Khalti';
  const themeColor = isKhalti ? COLORS.khalti : COLORS.esewa;
  const logoUrl = isKhalti 
    ? 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Khalti_Digital_Wallet_Logo.png.jpg'
    : 'https://cdn.esewa.com.np/ui/images/esewa_og.png?111';
  
  try {
    orderData = params.orderData ? JSON.parse(params.orderData as string) : null;
  } catch (error) {
    console.log('Error parsing order data:', error);
  }

  useEffect(() => {
    if (!provider || !totalAmount || !orderData) {
      Alert.alert('Error', 'Invalid payment parameters', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateForm = () => {
    if (!paymentForm.mobileNumber || paymentForm.mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!paymentForm.pin || paymentForm.pin.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit PIN');
      return false;
    }
    return true;
  };

  const handleInitiatePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call to initiate payment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowOtpInput(true);
    setCountdown(120); // 2 minutes countdown
    setLoading(false);
    
    Alert.alert(
      'OTP Sent',
      `A 6-digit OTP has been sent to ${paymentForm.mobileNumber}. Please enter it to complete the payment.`,
      [{ text: 'OK' }]
    );
  };

  const handlePayment = async () => {
    if (!paymentForm.otp || paymentForm.otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // First create the order
      const orderResponse = await client.post('/orders/create', orderData);
      
      if (orderResponse.data.status !== 'SUCCESS') {
        throw new Error('Failed to create order');
      }

      const orderId = orderResponse.data.data.orderId;

      // Simulate payment processing
      if (provider === 'Khalti') {
        await processKhaltiPayment(orderId, totalAmount);
      } else if (provider === 'eSewa') {
        await processESewaPayment(orderId, totalAmount);
      }

    } catch (error: any) {
      setPaymentStatus('failed');
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    }
    
    setLoading(false);
  };

  const processKhaltiPayment = async (orderId: string, amount: number) => {
    // Simulate Khalti payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate payment success (95% success rate for demo)
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      const transactionId = `khalti_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Update payment status in backend
      await client.post('/orders/payment-status', {
        orderId,
        paymentStatus: 'PAID',
        transactionId,
        paymentDetails: {
          provider: 'Khalti',
          transactionRef: transactionId,
          paidAmount: amount,
          paymentMethod: 'Digital Wallet',
          mobileNumber: paymentForm.mobileNumber
        }
      });
      
      setPaymentStatus('success');
      
      setTimeout(() => {
        Alert.alert(
          'Payment Successful!',
          `Your payment of Rs ${amount} has been processed successfully via Khalti.\n\nTransaction ID: ${transactionId.slice(-8)}`,
          [{ 
            text: 'Continue', 
            onPress: () => router.replace({
              pathname: '/customer/order-success',
              params: { orderId }
            } as any)
          }]
        );
      }, 1000);
      
    } else {
      throw new Error('Khalti payment verification failed');
    }
  };

  const processESewaPayment = async (orderId: string, amount: number) => {
    // Simulate eSewa payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate payment success (95% success rate for demo)
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      const transactionId = `esewa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Update payment status in backend
      await client.post('/orders/payment-status', {
        orderId,
        paymentStatus: 'PAID',
        transactionId,
        paymentDetails: {
          provider: 'eSewa',
          transactionRef: transactionId,
          paidAmount: amount,
          paymentMethod: 'Digital Wallet',
          mobileNumber: paymentForm.mobileNumber
        }
      });
      
      setPaymentStatus('success');
      
      setTimeout(() => {
        Alert.alert(
          'Payment Successful!',
          `Your payment of Rs ${amount} has been processed successfully via eSewa.\n\nTransaction ID: ${transactionId.slice(-8)}`,
          [{ 
            text: 'Continue', 
            onPress: () => router.replace({
              pathname: '/customer/order-success',
              params: { orderId }
            } as any)
          }]
        );
      }, 1000);
      
    } else {
      throw new Error('eSewa payment verification failed');
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <ActivityIndicator size={60} color={themeColor} />;
      case 'success':
        return <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />;
      case 'failed':
        return <Ionicons name="close-circle" size={60} color="#F44336" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return {
          title: 'Processing Payment...',
          subtitle: `Please wait while we verify your ${provider} payment`
        };
      case 'success':
        return {
          title: 'Payment Successful!',
          subtitle: 'Your order has been placed successfully'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          subtitle: 'There was an error processing your payment'
        };
      default:
        return {
          title: `Pay with ${provider}`,
          subtitle: `Secure payment powered by ${provider}`
        };
    }
  };

  const getProviderLogo = () => (
    <View style={styles.logoContainer}>
      <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
    </View>
  );

  const renderPaymentForm = () => (
    <View style={styles.formContainer}>
      {/* Amount Display */}
      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amountValue}>Rs {totalAmount.toLocaleString()}</Text>
      </View>

      {/* Mobile Number Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          {provider} Mobile Number
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="98XXXXXXXX"
          placeholderTextColor={COLORS.gray}
          value={paymentForm.mobileNumber}
          onChangeText={(text) => setPaymentForm({...paymentForm, mobileNumber: text})}
          keyboardType="numeric"
          maxLength={10}
          editable={!showOtpInput}
        />
      </View>

      {/* PIN Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          {provider} PIN
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your 4-digit PIN"
          placeholderTextColor={COLORS.gray}
          value={paymentForm.pin}
          onChangeText={(text) => setPaymentForm({...paymentForm, pin: text})}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          editable={!showOtpInput}
        />
      </View>

      {/* OTP Input (shown after PIN verification) */}
      {showOtpInput && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            OTP Verification
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter 6-digit OTP"
            placeholderTextColor={COLORS.gray}
            value={paymentForm.otp}
            onChangeText={(text) => setPaymentForm({...paymentForm, otp: text})}
            keyboardType="numeric"
            maxLength={6}
          />
          {countdown > 0 && (
            <Text style={styles.countdownText}>
              OTP expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColor }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Ionicons name="close" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay with {provider}</Text>
        <View style={{ width: 28 }} />
      </View>

      {paymentStatus === 'processing' || paymentStatus === 'success' || paymentStatus === 'failed' ? (
        // Payment Status Screen
        <View style={styles.statusScreen}>
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            <Text style={styles.statusTitle}>{getStatusMessage().title}</Text>
            <Text style={styles.statusSubtitle}>{getStatusMessage().subtitle}</Text>
          </View>

          {paymentStatus === 'failed' && (
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: themeColor }]}
                onPress={() => {
                  setPaymentStatus('form');
                  setShowOtpInput(false);
                  setPaymentForm({ mobileNumber: '', pin: '', otp: '' });
                }}
              >
                <Text style={styles.actionButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        // Payment Form Screen
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentCard}>
            {/* Provider Logo */}
            {getProviderLogo()}

            {/* Payment Form */}
            {renderPaymentForm()}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {!showOtpInput ? (
                <TouchableOpacity 
                  style={[styles.payButton, { backgroundColor: themeColor }, loading && styles.disabledButton]}
                  onPress={handleInitiatePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.payButtonText}>SEND OTP</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.payButton, { backgroundColor: themeColor }, loading && styles.disabledButton]}
                  onPress={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.payButtonText}>CONFIRM PAYMENT</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Security Notice */}
            <Text style={styles.securityText}>🔒 100% Secure Transaction</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20,
    paddingTop: 10
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  
  contentCard: { 
    flex: 1, 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 30, 
    alignItems: 'center',
    marginTop: 20
  },
  
  logoContainer: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: COLORS.white, 
    elevation: 5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: -70, 
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  logo: { width: 60, height: 60 },
  
  formContainer: {
    width: '100%',
    flex: 1
  },
  
  amountSection: {
    alignItems: 'center',
    marginBottom: 30
  },
  amountLabel: { 
    color: COLORS.gray, 
    fontSize: 14, 
    textTransform: 'uppercase',
    marginBottom: 5
  },
  amountValue: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: COLORS.dark
  },
  
  inputGroup: {
    width: '100%',
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: COLORS.lightGray,
    color: COLORS.dark
  },
  countdownText: {
    fontSize: 12,
    color: COLORS.khalti,
    marginTop: 5,
    textAlign: 'center'
  },
  
  buttonContainer: {
    width: '100%',
    marginTop: 20
  },
  payButton: {
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  disabledButton: { opacity: 0.6 },
  payButtonText: { 
    color: COLORS.white, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  
  securityText: { 
    marginTop: 20, 
    color: COLORS.gray, 
    fontSize: 12,
    textAlign: 'center'
  },
  
  // Status Screen Styles
  statusScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  statusTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: COLORS.dark, 
    marginTop: 15,
    textAlign: 'center'
  },
  statusSubtitle: { 
    fontSize: 14, 
    color: COLORS.gray, 
    textAlign: 'center', 
    marginTop: 8 
  },
  
  actionContainer: { 
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5
  },
  actionButtonText: { 
    color: COLORS.white, 
    fontWeight: 'bold' 
  },
  cancelButton: { 
    backgroundColor: COLORS.gray 
  },
  cancelButtonText: { 
    color: COLORS.white, 
    fontWeight: 'bold' 
  }
});