import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
// Ensure this path points to your actual CustomInput component
import CustomInput from '../components/ui/CustomInput';
import { client } from '../api/client'; 
import { SafeAreaView } from 'react-native-safe-area-context';
const COLORS = {
  backgroundCream: '#F8F4E9',
  accentOrange: '#E6753A',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

export default function OtpVerification() {
  const router = useRouter(); 
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- 1. SEND CODE LOGIC ---
  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      const response = await client.post(`/otp/send`, { email });
      
      if (response.data.status === "SUCCESS") {
        Alert.alert("Success", "Code sent! Check your Gmail.");
        setIsOtpSent(true); // Switch to OTP View
        setError('');
      } else {
        Alert.alert("Error", response.data.message || "Failed to send code");
      }
    } catch (error: any) {
      console.log("Send Error:", error);
      Alert.alert("Error", "Could not connect to backend. Check your IP!");
    }
    setLoading(false);
  };

  // --- 2. VERIFY CODE LOGIC ---
  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert("Error", "Please enter the code");

    setLoading(true);
    try {
      console.log('🔐 Verifying OTP:', { email, otp });
      
      const response = await client.post(`/otp/verify`, { 
        email: email,
        otp: otp 
      });

      console.log('📥 Verify response:', response.data);

      if (response.data.status === "SUCCESS") {
        Alert.alert("Success", "Verified!");
        
        // Go to Reset Password Screen
        router.push({
            pathname: "/reset-password",
            params: { email: email }
        });

      } else {
        Alert.alert("Failed", response.data.message || "Invalid Code");
      }
    } catch (error: any) {
      console.log("❌ Verify Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>
                {isOtpSent ? "Verify Email" : "Forgot Password?"}
            </Text>
            <Text style={styles.headerSubtitle}>
                {isOtpSent 
                    ? `Please enter the 4-digit code sent to ${email}`
                    : "Please enter the email associated with your account."
                }
            </Text>
          </View>

          {/* IMAGE */}
          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg' }} 
            style={styles.illustration}
            resizeMode="contain"
          />

          {/* INPUT SECTION */}
          <View style={styles.inputSection}>
            {/* Email Input */}
            <CustomInput 
              placeholder="Enter your email" 
              value={email} 
              setValue={(text) => { setEmail(text); setError(''); }} 
              keyboardType="email-address"
              error={error}
              // If your CustomInput supports 'editable', this locks it after sending
              editable={!isOtpSent} 
            />

            {/* OTP Input (Only appears after sending) */}
            {isOtpSent && (
                <View style={{ marginTop: 15 }}>
                    <CustomInput 
                        placeholder="Enter 4-digit Code" 
                        value={otp} 
                        setValue={setOtp} 
                        keyboardType="numeric"
                        maxLength={4}
                    />
                </View>
            )}
          </View>

          {/* BUTTON SECTION */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
                style={styles.mainButton} 
                onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator color={COLORS.white} />
              ) : (
                  <Text style={styles.mainButtonText}>
                      {isOtpSent ? "Verify & Proceed" : "Send Code"}
                  </Text>
              )}
            </TouchableOpacity>

            {/* Links at the bottom */}
            {isOtpSent ? (
                <TouchableOpacity onPress={() => setIsOtpSent(false)}>
                    <Text style={styles.backLink}>Change Email</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Back to Login</Text>
                </TouchableOpacity>
            )}
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