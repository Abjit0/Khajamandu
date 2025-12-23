import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
// FIXED PATH: Single dot "../"
import CustomInput from '../components/ui/CustomInput';

const COLORS = {
  backgroundCream: '#F8F4E9',
  accentOrange: '#E6753A',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); 

  const handleSendCode = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError('Email is required');
      return;
    } 
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    console.log('Sending OTP to:', email);
    // FIXED: Added 'as any'
    router.push('/otp-verification' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Forgot Password?</Text>
            <Text style={styles.headerSubtitle}>Please enter the email associated with your account.</Text>
          </View>

          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg' }} 
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.inputSection}>
            <CustomInput 
              placeholder="Enter your email" 
              value={email} 
              setValue={(text) => { setEmail(text); setError(''); }} 
              keyboardType="email-address"
              error={error} 
            />
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.mainButton} onPress={handleSendCode}>
              <Text style={styles.mainButtonText}>Send Code</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundCream },
  scrollContainer: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10 },
  headerSubtitle: { fontSize: 15, color: COLORS.textGray, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  illustration: { width: '100%', height: 200, marginBottom: 30 },
  inputSection: { marginBottom: 20 },
  buttonSection: { alignItems: 'center' },
  mainButton: { backgroundColor: COLORS.accentOrange, width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3 },
  mainButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  backLink: { color: COLORS.textGray, fontSize: 16, fontWeight: '600' },
});