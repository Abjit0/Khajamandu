import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Modal, Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { client, authAPI } from '../../api/client';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
  primary: '#E6753A',
  primaryDark: '#D4642F',
  primaryLight: '#FFE8DC',
  bg: '#F5F7FA',
  white: '#FFFFFF',
  dark: '#1A1A1A',
  darkGray: '#4A4A4A',
  gray: '#8A8A8A',
  lightGray: '#E8EAED',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  blue: '#3B82F6',
  blueLight: '#DBEAFE'
};

export default function RiderProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [riderData, setRiderData] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'bike',
    licenseNumber: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUserData();
    requestImagePermissions();
  }, []);

  const requestImagePermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload a profile picture');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        
        // Save to AsyncStorage immediately
        try {
          await authAPI.saveProfileImage(imageUri);
          Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
          console.log('Error saving image:', error);
          Alert.alert('Error', 'Failed to save profile picture');
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const loadUserData = async () => {
    try {
      const authData = await authAPI.getAuthData();
      if (authData.userData) {
        let user;
        if (typeof authData.userData === 'string') {
          user = JSON.parse(authData.userData);
        } else {
          user = authData.userData;
        }
        
        setUserData(user);
        
        // Load profile image
        const savedImage = await authAPI.getProfileImage();
        if (savedImage) {
          setProfileImage(savedImage);
        }
        
        // Load rider profile
        try {
          const riderResponse = await client.get(`/rider/profile/${user.id}`);
          if (riderResponse.data.status === 'SUCCESS') {
            const rider = riderResponse.data.data;
            setRiderData(rider);
            
            setFormData({
              name: user.profile?.name || '',
              phone: user.profile?.phone || '',
              email: user.email || '',
              vehicleType: rider.vehicle?.type || 'bike',
              licenseNumber: rider.documents?.licenseNumber || '',
              vehicleModel: rider.vehicle?.model || '',
              vehicleColor: rider.vehicle?.color || '',
              licensePlate: rider.vehicle?.licensePlate || ''
            });
          }
        } catch (error) {
          console.log('Rider profile not found, using user data only');
          setFormData({
            name: user.profile?.name || '',
            phone: user.profile?.phone || '',
            email: user.email || '',
            vehicleType: user.profile?.vehicleType || 'bike',
            licenseNumber: user.profile?.licenseNumber || '',
            vehicleModel: '',
            vehicleColor: '',
            licensePlate: ''
          });
        }
      }
    } catch (error) {
      console.log('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      // Update user profile
      const userUpdateResponse = await client.post('/user/update-profile', {
        userId: userData.id,
        name: formData.name,
        phone: formData.phone,
        vehicleType: formData.vehicleType,
        licenseNumber: formData.licenseNumber
      });

      // Update rider profile if exists
      if (riderData) {
        await client.post('/rider/update-profile', {
          riderId: userData.id,
          vehicle: {
            type: formData.vehicleType,
            model: formData.vehicleModel,
            color: formData.vehicleColor,
            licensePlate: formData.licensePlate
          },
          documents: {
            licenseNumber: formData.licenseNumber
          }
        });
      }

      // Update local storage
      const updatedUser = {
        ...userData,
        profile: {
          ...userData.profile,
          name: formData.name,
          phone: formData.phone,
          vehicleType: formData.vehicleType,
          licenseNumber: formData.licenseNumber
        }
      };
      
      const authData = await authAPI.getAuthData();
      await authAPI.storeAuthData(authData.token, updatedUser);
      
      Alert.alert('Success', 'Profile updated successfully');
      loadUserData();
    } catch (error: any) {
      console.log('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const response = await client.post('/user/change-password', {
        userId: userData.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.status === 'SUCCESS') {
        Alert.alert('Success', 'Password changed successfully');
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error: any) {
      console.log('Error changing password:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.clearAuthData();
              await authAPI.clearProfileImage();
              router.replace('/');
            } catch (error) {
              console.log('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={48} color={COLORS.primary} />
              )}
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{formData.name || 'Rider Name'}</Text>
          <Text style={styles.profileEmail}>{formData.email}</Text>
          
          {/* Account Status */}
          {userData && !userData.isApproved ? (
            <View style={styles.statusBadge}>
              <Ionicons name="time" size={16} color={COLORS.warning} />
              <Text style={styles.statusBadgeText}>Pending Approval</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusBadgeApproved]}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={[styles.statusBadgeText, styles.statusBadgeTextApproved]}>Verified</Text>
            </View>
          )}
        </View>

        {/* Account Status Banner */}
        {userData && !userData.isApproved && (
          <View style={styles.warningBanner}>
            <View style={styles.warningIconCircle}>
              <Ionicons name="warning" size={24} color={COLORS.warning} />
            </View>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Account Pending Approval</Text>
              <Text style={styles.warningSubtitle}>
                Your account is waiting for admin verification. You'll be notified once approved.
              </Text>
            </View>
          </View>
        )}

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.gray}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  placeholder="Enter your phone number"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, styles.inputDisabled]}>
                <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.disabledText]}
                  value={formData.email}
                  editable={false}
                />
                <Ionicons name="lock-closed" size={16} color={COLORS.gray} />
              </View>
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bicycle" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Type</Text>
              <View style={styles.vehicleTypeContainer}>
                {[
                  { type: 'bike', icon: 'bicycle', label: 'Bike' },
                  { type: 'scooter', icon: 'speedometer', label: 'Scooter' },
                  { type: 'car', icon: 'car', label: 'Car' }
                ].map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.type}
                    style={[
                      styles.vehicleTypeButton,
                      formData.vehicleType === vehicle.type && styles.vehicleTypeButtonActive
                    ]}
                    onPress={() => setFormData({...formData, vehicleType: vehicle.type})}
                  >
                    <Ionicons 
                      name={vehicle.icon as any} 
                      size={24} 
                      color={formData.vehicleType === vehicle.type ? COLORS.white : COLORS.gray} 
                    />
                    <Text style={[
                      styles.vehicleTypeText,
                      formData.vehicleType === vehicle.type && styles.vehicleTypeTextActive
                    ]}>
                      {vehicle.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.licenseNumber}
                  onChangeText={(text) => setFormData({...formData, licenseNumber: text})}
                  placeholder="Enter your license number"
                  placeholderTextColor={COLORS.gray}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Plate</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="pricetag-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.licensePlate}
                  onChangeText={(text) => setFormData({...formData, licensePlate: text})}
                  placeholder="e.g., BA 1 PA 1234"
                  placeholderTextColor={COLORS.gray}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Vehicle Model</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={formData.vehicleModel}
                    onChangeText={(text) => setFormData({...formData, vehicleModel: text})}
                    placeholder="e.g., Honda Activa"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={formData.vehicleColor}
                    onChangeText={(text) => setFormData({...formData, vehicleColor: text})}
                    placeholder="e.g., Red"
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="save" size={22} color={COLORS.white} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.passwordButton}
            onPress={() => setShowPasswordModal(true)}
          >
            <Ionicons name="lock-closed" size={22} color={COLORS.primary} />
            <Text style={styles.passwordButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={22} color={COLORS.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Password Change Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
              </View>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.modalSubtitle}>Enter your current password and choose a new one</Text>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={passwordData.currentPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                    placeholder="Enter current password"
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="key-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={passwordData.newPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                    placeholder="Enter new password"
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                    placeholder="Confirm new password"
                    placeholderTextColor={COLORS.gray}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleChangePassword}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.modalSaveButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.dark, letterSpacing: -0.3 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  
  // Profile Header Card
  profileHeaderCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
    elevation: 2,
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white
  },
  profileName: { fontSize: 24, fontWeight: '800', color: COLORS.dark, marginBottom: 4, letterSpacing: -0.5 },
  profileEmail: { fontSize: 14, color: COLORS.gray, marginBottom: 12, fontWeight: '500' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6
  },
  statusBadgeApproved: { backgroundColor: COLORS.successLight },
  statusBadgeText: { fontSize: 13, fontWeight: '700', color: COLORS.warning },
  statusBadgeTextApproved: { color: COLORS.success },
  
  // Warning Banner
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.warningLight,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning
  },
  warningIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  warningContent: { flex: 1 },
  warningTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
  warningSubtitle: { fontSize: 13, color: COLORS.darkGray, lineHeight: 18 },
  
  // Sections
  section: { marginBottom: 20, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark, letterSpacing: -0.3 },
  
  // Card
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4
  },
  
  // Input Groups
  inputGroup: { marginBottom: 16 },
  inputRow: { flexDirection: 'row', marginBottom: 0 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.dark, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.dark,
    fontWeight: '500',
    padding: 0
  },
  inputDisabled: { backgroundColor: '#F5F5F5' },
  disabledText: { color: COLORS.gray },
  helperText: { fontSize: 12, color: COLORS.gray, marginTop: 6, fontWeight: '500' },
  
  // Vehicle Type Selector
  vehicleTypeContainer: { flexDirection: 'row', gap: 10 },
  vehicleTypeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.bg,
    gap: 8
  },
  vehicleTypeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary
  },
  vehicleTypeText: { fontSize: 13, fontWeight: '700', color: COLORS.gray },
  vehicleTypeTextActive: { color: COLORS.white },
  
  // Action Buttons
  saveButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 10,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  
  passwordButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 10,
    borderWidth: 2,
    borderColor: COLORS.primary
  },
  passwordButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: COLORS.error
  },
  logoutButtonText: { color: COLORS.error, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '85%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle: { fontSize: 24, fontWeight: '800', color: COLORS.dark, marginBottom: 6, letterSpacing: -0.5 },
  modalSubtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 24, fontWeight: '500' },
  modalForm: { marginBottom: 20 },
  modalSaveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  modalSaveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 }
});
