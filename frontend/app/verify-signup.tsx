import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { client, authAPI } from '../api/client';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

export default function VerifySignup() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const role = params.role as string;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert('Error', 'Please enter the 4-digit code');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Verifying signup OTP:', { email, otp });
      
      const response = await client.post('/otp/verify', { 
        email: email,
        otp: otp 
      });

      console.log('📥 Verify response:', response.data);

      if (response.data.status === 'SUCCESS') {
        // Different flow based on role
        if (role === 'restaurant' || role === 'rider') {
          // Restaurant/Rider: Just verify, don't auto-login
          Alert.alert(
            '✅ Email Verified!',
            `Your ${role} account has been created successfully!\n\n⏳ Your account is pending admin approval. You'll be able to login once an admin approves your account.\n\nPlease check back later or contact support.`,
            [{ 
              text: 'OK', 
              onPress: () => router.replace('/' as any)
            }]
          );
        } else {
          // Customer: Auto-login after verification
          Alert.alert('Success', 'Email verified! Logging you in...');
          
          try {
            const loginResponse = await client.post('/otp/login', {
              email: email,
              password: params.password as string
            });

            if (loginResponse.data.status === 'SUCCESS') {
              // Store auth data
              if (loginResponse.data.data?.token) {
                await authAPI.storeAuthData(
                  loginResponse.data.data.token, 
                  loginResponse.data.data.user
                );
              }

              // Redirect to customer home
              router.replace('/customer/home' as any);
            } else {
              Alert.alert('Verified!', 'Please login with your credentials');
              router.replace('/' as any);
            }
          } catch (loginError) {
            console.log('Auto-login error:', loginError);
            Alert.alert('Verified!', 'Please login with your credentials');
            router.replace('/' as any);
          }
        }
      } else {
        Alert.alert('Failed', response.data.message || 'Invalid code');
      }
    } catch (error: any) {
      console.log('❌ Verify Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Verification failed');
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await client.post('/otp/send', { email });
      
      if (response.data.status === 'SUCCESS') {
        Alert.alert('Success', 'New code sent to your email!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend code');
      }
    } catch (error: any) {
      console.log('Resend error:', error);
      Alert.alert('Error', 'Failed to resend code');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={80} color={COLORS.primary} />
            </View>

            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 4-digit code to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                placeholder="Enter 4-digit code"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={4}
                autoFocus
              />
            </View>

            <TouchableOpacity 
              style={styles.verifyButton} 
              onPress={handleVerifyOtp}
              disabled={loading || otp.length !== 4}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.verifyButtonText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.gray} />
              <Text style={styles.backText}>Back to Signup</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: { 
    flexGrow: 1,
    padding: 30, 
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%'
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: COLORS.dark,
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 16, 
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24
  },
  email: {
    color: COLORS.primary,
    fontWeight: 'bold'
  },
  otpContainer: {
    width: '100%',
    marginBottom: 30
  },
  otpInput: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 10,
    fontWeight: 'bold',
    color: COLORS.dark,
    elevation: 2
  },
  verifyButton: { 
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3
  },
  verifyButtonText: { 
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30
  },
  resendText: {
    color: COLORS.gray,
    fontSize: 14
  },
  resendLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  backText: {
    color: COLORS.gray,
    fontSize: 14,
    marginLeft: 5
  }
});
