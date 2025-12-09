import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router'; 
import CustomInput from '../components/ui/CustomInput';
import { client, authAPI } from '../api/client'; 
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [loading, setLoading] = useState(false); 
  
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

  // --- UPDATED LOGIN FUNCTION ---
  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      console.log('🔐 Attempting login...');
      
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const response = await client.post(`/otp/login`, {
        email: cleanEmail,
        password: cleanPassword
      });

      console.log('📥 Login response:', response.data);

      if (response.data.status === "SUCCESS") {
        console.log('✅ Login Success for:', cleanEmail);
        
        // Store the JWT token if provided
        if (response.data.data?.token) {
          await authAPI.storeAuthData(response.data.data.token, response.data.data.user);
          console.log('🔑 Token stored successfully');
        }
        
        // Smart redirect based on user role
        const userRole = response.data.data?.user?.role || 'customer';
        console.log('👤 User role:', userRole);
        
        if (userRole === 'restaurant') {
          console.log('🍽️ Redirecting to Restaurant Dashboard');
          router.replace('/restaurant/dashboard' as any);
        } else if (userRole === 'admin') {
          console.log('👨‍💼 Redirecting to Admin Panel');
          router.replace('/admin/dashboard' as any);
        } else if (userRole === 'rider') {
          console.log('🚴 Redirecting to Rider Dashboard');
          router.replace('/rider/dashboard' as any);
        } else {
          console.log('🏠 Redirecting to Home');
          router.replace('/customer/home' as any);
        }
      } else {
        Alert.alert("Login Failed", response.data.message || "Incorrect email or password");
      }
    } catch (error: any) {
      console.log('❌ Login error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        Alert.alert("Login Failed", "Invalid email or password");
      } else if (error.response?.status === 400) {
        Alert.alert("Login Failed", error.response.data.message || "Please check your input");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Login to Khajamandu</Text>
            <Text style={styles.headerSubtitle}>Login to continue</Text>
          </View>

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
              // ✅ Points to your OTP Verification page
              onPress={() => router.push('/otp-verification' as any)}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonSection}>
            <TouchableOpacity 
                style={styles.mainButton} 
                onPress={handleLogin}
                disabled={loading} 
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.mainButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
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