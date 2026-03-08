import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { client } from '../api/client';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

export default function SignupEnhancedScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    // Profile fields
    name: '',
    phone: '',
    address: '',
    // Restaurant fields
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    cuisine: '',
    // Rider fields
    vehicleType: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'customer', name: 'Customer', icon: 'person', desc: 'Order food from restaurants' },
    { id: 'restaurant', name: 'Restaurant', icon: 'restaurant', desc: 'Manage menu and orders' },
    { id: 'rider', name: 'Delivery Rider', icon: 'bicycle', desc: 'Deliver orders to customers' }
  ];

  const vehicleTypes = [
    { id: 'bike', name: 'Motorcycle' },
    { id: 'scooter', name: 'Scooter' },
    { id: 'car', name: 'Car' }
  ];

  const cuisineTypes = [
    'Nepali', 'Indian', 'Chinese', 'Continental', 'Italian', 'Fast Food', 'Bakery', 'Beverages'
  ];

  const handleSignup = async () => {
    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Check for common invalid/fake emails
    const invalidEmails = ['test@test.com', 'john@gmail.com', 'example@example.com', 'user@user.com'];
    if (invalidEmails.includes(formData.email.toLowerCase().trim())) {
      Alert.alert('Invalid Email', 'Please use a real email address. This email appears to be a test/placeholder email.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Role-specific validation
    if (formData.role === 'restaurant' && !formData.restaurantName) {
      Alert.alert('Error', 'Restaurant name is required');
      return;
    }

    if (formData.role === 'rider' && (!formData.vehicleType || !formData.licenseNumber)) {
      Alert.alert('Error', 'Vehicle type and license number are required for riders');
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        profile: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          ...(formData.role === 'restaurant' && {
            restaurantName: formData.restaurantName,
            restaurantAddress: formData.restaurantAddress,
            restaurantPhone: formData.restaurantPhone,
            cuisine: formData.cuisine
          }),
          ...(formData.role === 'rider' && {
            vehicleType: formData.vehicleType,
            licenseNumber: formData.licenseNumber
          })
        }
      };

      console.log('📤 Signup request:', signupData);

      const response = await client.post('/otp/signup', signupData);
      
      if (response.data.status === 'SUCCESS') {
        Alert.alert(
          'Success!', 
          'Account created! Please check your email for verification code.\n\nNote: If you don\'t receive the email, check your backend console for the OTP code.',
          [{ 
            text: 'OK', 
            onPress: () => router.push({
              pathname: '/verify-signup',
              params: { 
                email: formData.email.trim().toLowerCase(),
                role: formData.role,
                password: formData.password // For auto-login after verification
              }
            } as any)
          }]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Signup failed');
      }
    } catch (error: any) {
      console.log('❌ Signup error:', error.response?.data || error.message);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        Alert.alert('Email Already Registered', 'This email is already registered. Please login or use a different email.');
      } else if (error.response?.data?.message) {
        Alert.alert('Signup Failed', error.response.data.message);
      } else {
        Alert.alert('Error', 'Signup failed. Please check your internet connection and try again.');
      }
    }
    setLoading(false);
  };

  const renderRoleSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>I want to join as:</Text>
      {roles.map(role => (
        <TouchableOpacity
          key={role.id}
          style={[styles.roleOption, formData.role === role.id && styles.selectedRole]}
          onPress={() => setFormData({...formData, role: role.id})}
        >
          <Ionicons name={role.icon as any} size={24} color={formData.role === role.id ? COLORS.primary : COLORS.gray} />
          <View style={styles.roleText}>
            <Text style={[styles.roleName, formData.role === role.id && styles.selectedRoleText]}>{role.name}</Text>
            <Text style={styles.roleDesc}>{role.desc}</Text>
          </View>
          <View style={styles.radio}>
            {formData.role === role.id && <View style={styles.radioSelected} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBasicFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Address *"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(text) => setFormData({...formData, phone: text})}
        keyboardType="default"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => setFormData({...formData, address: text})}
        multiline
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password *"
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password *"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
        secureTextEntry
      />
    </View>
  );

  const renderRestaurantFields = () => {
    if (formData.role !== 'restaurant') return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurant Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Restaurant Name *"
          value={formData.restaurantName}
          onChangeText={(text) => setFormData({...formData, restaurantName: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Restaurant Address"
          value={formData.restaurantAddress}
          onChangeText={(text) => setFormData({...formData, restaurantAddress: text})}
          multiline
        />
        
        <TextInput
          style={styles.input}
          placeholder="Restaurant Phone"
          value={formData.restaurantPhone}
          onChangeText={(text) => setFormData({...formData, restaurantPhone: text})}
          keyboardType="default"
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Cuisine Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cuisineScroll}>
            {cuisineTypes.map(cuisine => (
              <TouchableOpacity
                key={cuisine}
                style={[styles.cuisineChip, formData.cuisine === cuisine && styles.selectedCuisine]}
                onPress={() => setFormData({...formData, cuisine})}
              >
                <Text style={[styles.cuisineText, formData.cuisine === cuisine && styles.selectedCuisineText]}>
                  {cuisine}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderRiderFields = () => {
    if (formData.role !== 'rider') return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rider Information</Text>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Vehicle Type *:</Text>
          {vehicleTypes.map(vehicle => (
            <TouchableOpacity
              key={vehicle.id}
              style={[styles.vehicleOption, formData.vehicleType === vehicle.id && styles.selectedVehicle]}
              onPress={() => setFormData({...formData, vehicleType: vehicle.id})}
            >
              <Text style={[styles.vehicleText, formData.vehicleType === vehicle.id && styles.selectedVehicleText]}>
                {vehicle.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="License Number *"
          value={formData.licenseNumber}
          onChangeText={(text) => setFormData({...formData, licenseNumber: text})}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderRoleSelector()}
          {renderBasicFields()}
          {renderRestaurantFields()}
          {renderRiderFields()}

          <TouchableOpacity 
            style={[styles.signupButton, loading && styles.disabledButton]} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={styles.loginLink}>Already have an account? Login</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center', 
    backgroundColor: COLORS.white,
    elevation: 2
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  scrollContent: { padding: 20 },
  
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: COLORS.dark },
  
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 1
  },
  selectedRole: { borderColor: COLORS.primary, backgroundColor: '#FFF0E6' },
  roleText: { flex: 1, marginLeft: 12 },
  roleName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  selectedRoleText: { color: COLORS.primary },
  roleDesc: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  radio: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: COLORS.gray, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioSelected: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    elevation: 1
  },
  
  pickerContainer: { marginBottom: 15 },
  pickerLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: COLORS.dark },
  
  cuisineScroll: { flexDirection: 'row' },
  cuisineChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray
  },
  selectedCuisine: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  cuisineText: { fontSize: 12, color: COLORS.dark },
  selectedCuisineText: { color: COLORS.white },
  
  vehicleOption: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.gray
  },
  selectedVehicle: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  vehicleText: { fontSize: 14, color: COLORS.dark, textAlign: 'center' },
  selectedVehicleText: { color: COLORS.white },
  
  signupButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2
  },
  disabledButton: { backgroundColor: COLORS.gray, opacity: 0.6 },
  signupButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  
  loginLink: {
    textAlign: 'center',
    color: COLORS.primary,
    marginTop: 20,
    fontSize: 16
  }
});