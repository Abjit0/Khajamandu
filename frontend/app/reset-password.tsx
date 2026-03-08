import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Added useLocalSearchParams
import CustomInput from '../components/ui/CustomInput';
import { client } from '../api/client'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const COLORS = {
  backgroundCream: '#F8F4E9',
  accentOrange: '#E6753A',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  // 1. Get the email passed from the OTP screen
  const { email } = useLocalSearchParams(); 

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleResetPassword = async () => {
    // Basic Validation
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Resetting password for:', email);
      
      // 2. CALL THE BACKEND TO SAVE PASSWORD
      const response = await client.post(`/otp/reset-password`, {
        email: email, // Use the email from params
        newPassword: newPassword
      });

      console.log('📥 Reset password response:', response.data);

      if (response.data.status === "SUCCESS") {
        // Store the JWT token if provided
        if (response.data.data?.token) {
          await AsyncStorage.setItem('authToken', response.data.data.token);
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
          console.log('🔑 Token stored successfully');
        }
        
        Alert.alert('Success', 'Password saved! You can now login.', [
          { text: 'Login Now', onPress: () => router.replace('/') } 
        ]);
      } else {
        Alert.alert('Error', response.data.message || "Failed to update password");
      }
    } catch (error: any) {
      console.log('❌ Reset password error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Could not connect to server.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Reset Password</Text>
            <Text style={styles.headerSubtitle}>
               {/* Show the email so user knows it's working */}
               Setting new password for: {email}
            </Text>
          </View>

          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7886.jpg' }} 
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.inputSection}>
            <CustomInput 
              placeholder="New Password" 
              value={newPassword} 
              setValue={setNewPassword} 
              isPassword={true} 
            />
            <CustomInput 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              setValue={setConfirmPassword} 
              isPassword={true} 
            />
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity 
                style={styles.mainButton} 
                onPress={handleResetPassword}
                disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.mainButtonText}>Reset Password</Text>
              )}
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
  headerSubtitle: { fontSize: 15, color: COLORS.textGray, textAlign: 'center', paddingHorizontal: 20 },
  illustration: { width: '100%', height: 200, marginBottom: 30 },
  inputSection: { marginBottom: 20 },
  buttonSection: { alignItems: 'center' },
  mainButton: { backgroundColor: COLORS.accentOrange, width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3 },
  mainButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});