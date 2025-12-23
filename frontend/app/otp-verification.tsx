import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../components/ui/CustomInput';

const COLORS = {
  backgroundCream: '#F8F4E9',
  accentOrange: '#E6753A',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

export default function OtpVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');

 const handleVerify = () => {
    if (otp.length < 4) {
      Alert.alert('Invalid Code', 'Please enter the 4-digit code sent to your email.');
      return;
    }
    
    // CHANGE THIS: Instead of alerting success immediately, move to the next screen
    console.log('OTP Verified');
    router.push('/reset-password'); // <--- Go to Reset Password Screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>OTP Verification</Text>
            <Text style={styles.headerSubtitle}>Enter the verification code we just sent to your email address.</Text>
          </View>

          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/enter-otp-concept-illustration_114360-7867.jpg' }} 
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.inputSection}>
            <CustomInput 
              placeholder="Enter OTP Code" 
              value={otp} 
              setValue={setOtp} 
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.mainButton} onPress={handleVerify}>
              <Text style={styles.mainButtonText}>Verify</Text>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive code? </Text>
                <TouchableOpacity onPress={() => console.log("Resend Code")}>
                    <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
            </View>
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
  headerSubtitle: { fontSize: 15, color: COLORS.textGray, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  illustration: { width: '100%', height: 200, marginBottom: 30 },
  inputSection: { marginBottom: 20 },
  buttonSection: { alignItems: 'center' },
  mainButton: { backgroundColor: COLORS.accentOrange, width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3 },
  mainButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  resendContainer: { flexDirection: 'row' },
  resendText: { color: COLORS.textGray, fontSize: 15 },
  resendLink: { color: COLORS.accentOrange, fontWeight: 'bold', fontSize: 15 },
});