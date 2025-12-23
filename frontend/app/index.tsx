import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router'; 
// FIXED PATH: Single dot
import CustomInput from '../components/ui/CustomInput';

const COLORS = {
  backgroundCream: '#F8F4E9',
  accentOrange: '#E6753A',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

export default function LoginScreen() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let isValid = true;

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError(''); 
    }

    // Validate Password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = () => {
    if (validate()) {
      console.log('Login Success:', email);
      // FIXED: Added 'as any'
      router.replace('/home' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Login to Khajamandu</Text>
            <Text style={styles.headerSubtitle}>Login to continue</Text>
          </View>

          {/* FIXED PATH: Single dot */}
          <Image 
           source={require('../assets/images/van.png')}
            style={styles.illustration}
            resizeMode="contain"
          />

          <View style={styles.inputSection}>
            <CustomInput 
              placeholder="Email Address" 
              value={email} 
              setValue={(text: string) => { setEmail(text); setEmailError(''); }} 
              keyboardType="email-address"
              error={emailError} 
            />
            <CustomInput 
              placeholder="Password" 
              value={password} 
              setValue={(text: string) => { setPassword(text); setPasswordError(''); }}
              isPassword={true}
              error={passwordError}
            />
            
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              // FIXED: Added 'as any'
              onPress={() => router.push('/forgot-password' as any)}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.mainButton} onPress={handleLogin}>
              <Text style={styles.mainButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              {/* FIXED: Added 'as any' */}
              <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                <Text style={styles.footerLink}>Sign Up</Text>
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
  headerSection: { alignItems: 'center', marginBottom: 20, marginTop: 40 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: COLORS.textGray, fontWeight: '500' },
  illustration: { width: '100%', height: 220, marginBottom: 30 },
  inputSection: { marginBottom: 20 },
  forgotPasswordContainer: { alignItems: 'flex-end', marginTop: 5, marginRight: 10 },
  forgotPasswordText: { color: COLORS.accentOrange, fontWeight: '600' },
  buttonSection: { alignItems: 'center' },
  mainButton: { backgroundColor: COLORS.accentOrange, width: '100%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3 },
  mainButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  footerText: { color: COLORS.textGray, fontSize: 15 },
  footerLink: { color: COLORS.accentOrange, fontWeight: 'bold', fontSize: 15 },
});