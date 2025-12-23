import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
// FIXED PATH: Single dot "../" because file is in app/ folder
import CustomInput from '../components/ui/CustomInput';

const COLORS = {
  backgroundCream: '#F8F4E9',
  accentOrange: '#E6753A',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error States
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const validate = () => {
    let isValid = true;

    // Name Validation
    if (!fullName.trim()) {
      setNameError('Full name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password Validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 chars');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm Password
    if (confirmPassword !== password) {
      setConfirmError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmError('');
    }

    return isValid;
  };

  const handleSignUp = () => {
    if (validate()) {
      console.log('Sign Up registering:', fullName, email);
      // FIXED: Added 'as any' to prevent TypeScript errors
      router.replace('/home' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>It's quick & easy</Text>
          </View>

          {/* FIXED PATH: Single dot "../" */}
          <Image 
            source={require('../assets/images/lady.png')}
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.inputSection}>
            <CustomInput 
                placeholder="Full Name" 
                value={fullName} 
                setValue={(text) => { setFullName(text); setNameError(''); }}
                error={nameError}
            />
            <CustomInput 
                placeholder="Email Address" 
                value={email} 
                setValue={(text) => { setEmail(text); setEmailError(''); }} 
                keyboardType="email-address"
                error={emailError}
            />
            <CustomInput 
                placeholder="Password" 
                value={password} 
                setValue={(text) => { setPassword(text); setPasswordError(''); }} 
                isPassword={true} 
                error={passwordError}
            />
            <CustomInput 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                setValue={(text) => { setConfirmPassword(text); setConfirmError(''); }} 
                isPassword={true} 
                error={confirmError}
            />
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By clicking Sign Up agree our <Text style={styles.termsLink}>Terms</Text>
            </Text>
            <Text style={styles.termsText}>
             <Text style={styles.termsLink}>Terms</Text> and Privacy Policy.
            </Text>
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.mainButton} onPress={handleSignUp}>
              <Text style={styles.mainButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.footerLink}>Login</Text>
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
  headerSection: { alignItems: 'center', marginBottom: 20, marginTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 8, textAlign: 'center' },
  headerSubtitle: { fontSize: 16, color: COLORS.textGray, fontWeight: '500' },
  illustration: { width: '100%', height: 180, marginBottom: 20 },
  inputSection: { marginBottom: 10 },
  termsContainer: { alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  termsText: { color: COLORS.textGray, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  termsLink: { color: COLORS.accentOrange, fontWeight: 'bold' },
  buttonSection: { alignItems: 'center' },
  mainButton: { backgroundColor: COLORS.accentOrange, width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3 },
  mainButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  footerText: { color: COLORS.textGray, fontSize: 15 },
  footerLink: { color: COLORS.accentOrange, fontWeight: 'bold', fontSize: 15 },
});