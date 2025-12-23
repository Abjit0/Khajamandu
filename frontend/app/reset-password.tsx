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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    // 1. Basic Validation
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // 2. Check if passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
      return;
    }

    // 3. Success!
    Alert.alert('Success', 'Your password has been reset successfully!', [
      { text: 'Login Now', onPress: () => router.replace('/') } // Go to Login
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Reset Password</Text>
            <Text style={styles.headerSubtitle}>Please enter your new password below.</Text>
          </View>

          {/* Illustration */}
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
            <TouchableOpacity style={styles.mainButton} onPress={handleResetPassword}>
              <Text style={styles.mainButtonText}>Reset Password</Text>
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