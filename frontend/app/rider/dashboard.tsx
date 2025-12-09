import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch, Linking, Platform 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { client, authAPI } from '../../api/client';
import * as Location from 'expo-location';
import { Image } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

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

export default function RiderDashboard() {
  const router = useRouter();
  const [riderData, setRiderData] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    checkUserRole();
    requestLocationPermission();
    loadProfileImage();
  }, []);

  // Reload profile image whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadProfileImage();
    }, [])
  );

  useEffect(() => {
    if (riderData) {
      fetchRiderData();
      
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchRiderData();
        if (isOnline) {
          updateRiderLocation();
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [riderData, isOnline]);

  const loadProfileImage = async () => {
    try {
      const savedImage = await authAPI.getProfileImage();
      if (savedImage) {
        setProfileImage(savedImage);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.log('Error loading profile image:', error);
    }
  };

  const checkUserRole = async () => {
    try {
      const authData = await authAPI.getAuthData();
      if (authData.userData) {
        let userData;
        if (typeof authData.userData === 'string') {
          userData = JSON.parse(authData.userData);
        } else {
          userData = authData.userData;
        }
        
        setRiderData(userData);
        
        if (userData.role !== 'rider') {
          Alert.alert('Access Denied', 'This page is only for delivery riders', [
            { text: 'OK', onPress: () => router.replace('/customer/home') }
          ]);
          return;
        }

        // Check if rider is approved
        if (!userData.isApproved) {
          Alert.alert(
            'Account Pending Approval',
            'Your rider account is waiting for admin verification. You will be notified once approved.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.log('Error checking user role:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      } else {
        Alert.alert('Permission Denied', 'Location permission is required for delivery tracking');
      }
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };

  const updateRiderLocation = async () => {
    if (!locationPermission || !riderData) return;
    
    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      
      await client.post('/rider/update-location', {
        riderId: riderData.id,
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      });
    } catch (error) {
      console.log('Update location error:', error);
    }
  };

  const fetchRiderData = async () => {
    if (!riderData) return;
    
    try {
      // Ensure rider profile exists first
      await ensureRiderProfile();
      
      // Fetch available deliveries
      const ordersResponse = await client.get(`/rider/available-deliveries/${riderData.id}`);
      if (ordersResponse.data.status === 'SUCCESS') {
        setAvailableOrders(ordersResponse.data.data);
      }

      // Fetch active delivery
      try {
        const activeResponse = await client.get(`/rider/active-delivery/${riderData.id}`);
        if (activeResponse.data.status === 'SUCCESS') {
          setActiveDelivery(activeResponse.data.data);
        }
      } catch (error) {
        // Active delivery might not exist yet
        console.log('No active delivery');
      }

      // Fetch stats
      try {
        const statsResponse = await client.get(`/rider/stats/${riderData.id}`);
        if (statsResponse.data.status === 'SUCCESS') {
          setStats(statsResponse.data.data);
        }
      } catch (error) {
        // Stats might not exist yet
        console.log('No stats yet');
      }
    } catch (error: any) {
      console.log('Error fetching rider data:', error.response?.data || error.message);
    }
    setLoading(false);
  };

  const toggleOnlineStatus = async (value: boolean) => {
    if (!locationPermission && value) {
      Alert.alert('Location Required', 'Please enable location services to go online');
      return;
    }

    // Check if rider is approved
    if (!riderData?.isApproved && value) {
      Alert.alert(
        'Account Not Approved',
        'Your account is pending admin approval. You cannot go online until your account is verified.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // First, ensure rider profile exists
      await ensureRiderProfile();
      
      const response = await client.post('/rider/toggle-status', {
        riderId: riderData.id,
        isOnline: value
      });

      if (response.data.status === 'SUCCESS') {
        setIsOnline(value);
        if (value) {
          Alert.alert('You are Online', 'You will now receive delivery requests');
          updateRiderLocation();
        } else {
          Alert.alert('You are Offline', 'You will not receive delivery requests');
        }
      }
    } catch (error: any) {
      console.log('Toggle status error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update status');
    }
  };

  const ensureRiderProfile = async () => {
    try {
      // Check if rider profile exists
      const profileResponse = await client.get(`/rider/profile/${riderData.id}`);
      if (profileResponse.data.status === 'SUCCESS') {
        return; // Profile exists
      }
    } catch (error: any) {
      // Profile doesn't exist, create it
      if (error.response?.status === 404) {
        try {
          await client.post('/rider/initialize', {
            userId: riderData.id,
            vehicleType: riderData.profile?.vehicleType || 'bike',
            licenseNumber: riderData.profile?.licenseNumber || 'N/A'
          });
          console.log('✅ Rider profile initialized');
        } catch (initError) {
          console.log('Error initializing rider profile:', initError);
        }
      }
    }
  };

  const acceptDelivery = async (orderId: string) => {
    Alert.alert(
      'Accept Delivery',
      'Do you want to accept this delivery?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await client.post('/rider/accept-delivery', {
                riderId: riderData.id,
                orderId: orderId
              });

              if (response.data.status === 'SUCCESS') {
                Alert.alert('Success', 'Delivery accepted! Navigate to restaurant.');
                fetchRiderData();
              }
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to accept delivery');
            }
          }
        }
      ]
    );
  };

  const updateDeliveryStatus = async (status: string) => {
    if (!activeDelivery || !activeDelivery.orderId) return;

    try {
      const response = await client.post('/rider/update-delivery-status', {
        riderId: riderData.id,
        orderId: activeDelivery.orderId._id || activeDelivery.orderId,
        status: status
      });

      if (response.data.status === 'SUCCESS') {
        let message = '';
        if (status === 'picked_up') message = 'Order picked up!';
        else if (status === 'on_the_way') message = 'On the way to customer!';
        else if (status === 'delivered') message = '🎉 Delivery completed!';
        
        Alert.alert('Success', message);
        fetchRiderData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update delivery status');
    }
  };

  const openNavigation = (order: any) => {
    // Parse delivery address to get coordinates (in real app, you'd have lat/lng from order)
    // For now, we'll use a placeholder and open maps with the address
    const address = encodeURIComponent(order.deliveryAddress);
    
    Alert.alert(
      'Open Navigation',
      'Choose your navigation app',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Google Maps', 
          onPress: () => {
            const url = Platform.select({
              ios: `comgooglemaps://?daddr=${address}`,
              android: `google.navigation:q=${address}`
            });
            
            Linking.canOpenURL(url!).then(supported => {
              if (supported) {
                Linking.openURL(url!);
              } else {
                // Fallback to web version
                Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
              }
            });
          }
        },
        {
          text: 'Apple Maps',
          onPress: () => {
            const url = `maps://app?daddr=${address}`;
            Linking.openURL(url);
          }
        }
      ]
    );
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1); // Return distance in km with 1 decimal
  };

  const renderAvailableOrders = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Deliveries</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{availableOrders.length}</Text>
        </View>
      </View>
      
      {availableOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bicycle-outline" size={48} color={COLORS.gray} />
          </View>
          <Text style={styles.emptyTitle}>No deliveries available</Text>
          <Text style={styles.emptySubtitle}>New orders will appear here when restaurants mark them ready</Text>
        </View>
      ) : (
        availableOrders.map((order) => (
          <View key={order._id} style={styles.orderCard}>
            <View style={styles.orderCardHeader}>
              <View style={styles.orderBadge}>
                <Text style={styles.orderBadgeText}>NEW</Text>
              </View>
              <Text style={styles.orderAmount}>Rs {order.totalAmount}</Text>
            </View>
            
            <View style={styles.orderInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="restaurant" size={18} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Restaurant</Text>
                  <Text style={styles.infoValue}>{order.restaurantName}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="location" size={18} color={COLORS.error} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Delivery Address</Text>
                  <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="person" size={18} color={COLORS.blue} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Customer</Text>
                  <Text style={styles.infoValue}>{order.customerName}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptDelivery(order._id)}
            >
              <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
              <Text style={styles.acceptButtonText}>Accept Delivery</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );

  const renderActiveDelivery = () => {
    if (!activeDelivery || activeDelivery.status === 'idle') return null;

    const order = activeDelivery.orderId;
    if (!order) return null;

    const isCOD = order.paymentMethod === 'COD';
    const cashToCollect = isCOD ? order.totalAmount : 0;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Delivery</Text>
          <View style={[styles.statusPill, styles.statusActive]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>IN PROGRESS</Text>
          </View>
        </View>
        
        <View style={styles.activeDeliveryCard}>
          {/* Order Header */}
          <View style={styles.activeOrderHeader}>
            <View>
              <Text style={styles.activeOrderId}>Order #{order._id?.slice(-6) || 'N/A'}</Text>
              <Text style={styles.activeOrderAmount}>Rs {order.totalAmount}</Text>
            </View>
            
            {isCOD && (
              <View style={styles.codBadgeLarge}>
                <Ionicons name="cash" size={20} color={COLORS.white} />
                <Text style={styles.codBadgeText}>COLLECT Rs {cashToCollect}</Text>
              </View>
            )}
          </View>

          {/* Status Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: activeDelivery.status === 'assigned' ? '33%' : 
                         activeDelivery.status === 'picked_up' ? '66%' : '100%' }
              ]} />
            </View>
            <Text style={styles.progressText}>
              {activeDelivery.status === 'assigned' && '📦 Heading to restaurant'}
              {activeDelivery.status === 'picked_up' && '🚴 Food picked up'}
              {activeDelivery.status === 'on_the_way' && '🏠 On the way to customer'}
            </Text>
          </View>

          {/* Map View */}
          {currentLocation && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={true}
              >
                {/* Rider's Current Location Marker */}
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title="Your Location"
                  description="You are here"
                >
                  <View style={styles.riderMarker}>
                    <Ionicons name="bicycle" size={24} color={COLORS.white} />
                  </View>
                </Marker>

                {/* Destination Marker (simulated - in real app use actual coordinates) */}
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude + 0.01,
                    longitude: currentLocation.longitude + 0.01,
                  }}
                  title="Delivery Location"
                  description={order.deliveryAddress}
                >
                  <View style={styles.destinationMarker}>
                    <Ionicons name="home" size={24} color={COLORS.white} />
                  </View>
                </Marker>

                {/* Route Line */}
                <Polyline
                  coordinates={[
                    {
                      latitude: currentLocation.latitude,
                      longitude: currentLocation.longitude,
                    },
                    {
                      latitude: currentLocation.latitude + 0.01,
                      longitude: currentLocation.longitude + 0.01,
                    },
                  ]}
                  strokeColor={COLORS.primary}
                  strokeWidth={4}
                  lineDashPattern={[1]}
                />
              </MapView>

              {/* Distance Badge */}
              <View style={styles.distanceBadge}>
                <Ionicons name="navigate" size={16} color={COLORS.primary} />
                <Text style={styles.distanceText}>
                  {calculateDistance(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    currentLocation.latitude + 0.01,
                    currentLocation.longitude + 0.01
                  )} km away
                </Text>
              </View>
            </View>
          )}
          
          {/* Order Details */}
          <View style={styles.activeOrderInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="restaurant" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Restaurant</Text>
                <Text style={styles.infoValue}>{order.restaurantName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={18} color={COLORS.error} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Delivery Address</Text>
                <Text style={styles.infoValue}>{order.deliveryAddress}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person" size={18} color={COLORS.blue} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Customer</Text>
                <Text style={styles.infoValue}>{order.customerName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call" size={18} color={COLORS.success} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{order.customerPhone || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="card" size={18} color={isCOD ? COLORS.warning : COLORS.success} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Payment</Text>
                <Text style={[styles.infoValue, isCOD && { color: COLORS.warning, fontWeight: 'bold' }]}>
                  {order.paymentMethod} {isCOD ? '(Collect Cash)' : '(Paid Online)'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.navButtonLarge}
              onPress={() => openNavigation(order)}
            >
              <Ionicons name="navigate" size={22} color={COLORS.white} />
              <Text style={styles.navButtonText}>Navigate</Text>
            </TouchableOpacity>
            
            {activeDelivery.status === 'assigned' && (
              <TouchableOpacity
                style={styles.statusButtonLarge}
                onPress={() => updateDeliveryStatus('picked_up')}
              >
                <Ionicons name="bag-check" size={22} color={COLORS.white} />
                <Text style={styles.statusButtonText}>Picked Up</Text>
              </TouchableOpacity>
            )}
            
            {activeDelivery.status === 'picked_up' && (
              <TouchableOpacity
                style={styles.statusButtonLarge}
                onPress={() => updateDeliveryStatus('on_the_way')}
              >
                <Ionicons name="bicycle" size={22} color={COLORS.white} />
                <Text style={styles.statusButtonText}>On the Way</Text>
              </TouchableOpacity>
            )}
            
            {(activeDelivery.status === 'on_the_way' || activeDelivery.status === 'picked_up') && (
              <TouchableOpacity
                style={styles.completeButtonLarge}
                onPress={() => {
                  if (isCOD) {
                    confirmCODCollection(order);
                  } else {
                    updateDeliveryStatus('delivered');
                  }
                }}
              >
                <Ionicons name="checkmark-done" size={22} color={COLORS.white} />
                <Text style={styles.completeButtonText}>
                  {isCOD ? 'Collect & Deliver' : 'Mark Delivered'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const confirmCODCollection = (order: any) => {
    Alert.alert(
      'Cash on Delivery',
      `Collect Rs ${order.totalAmount} from customer and confirm delivery.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Cash Collected',
          onPress: () => {
            Alert.alert(
              'Confirm Delivery',
              'Have you collected the cash and delivered the order?',
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes, Delivered',
                  onPress: () => updateDeliveryStatus('delivered')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <View style={[styles.section, { marginTop: 24 }]}>
        <View style={styles.statsContainer}>
          {/* Today's Earnings - Large Featured Card */}
          <View style={styles.featuredCard}>
            <View style={styles.featuredCardHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="wallet" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.featuredLabel}>Today's Earnings</Text>
            </View>
            <Text style={styles.featuredValue}>Rs {stats.earnings?.today || 0}</Text>
            <View style={styles.featuredFooter}>
              <View style={styles.miniStat}>
                <Ionicons name="trending-up" size={16} color={COLORS.success} />
                <Text style={styles.miniStatText}>+12% from yesterday</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: COLORS.successLight }]}>
              <View style={[styles.statIconCircle, { backgroundColor: COLORS.success }]}>
                <Ionicons name="checkmark-done" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.statValue}>{stats.stats?.completedDeliveries || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: COLORS.blueLight }]}>
              <View style={[styles.statIconCircle, { backgroundColor: COLORS.blue }]}>
                <Ionicons name="cash" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.statValue}>Rs {stats.earnings?.total || 0}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.profileButtonLeft}
            onPress={() => router.push('/rider/profile' as any)}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle" size={40} color={COLORS.primary} />
            )}
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Rider Dashboard</Text>
            <Text style={styles.headerSubtitle}>{riderData?.profile?.name || 'Rider'}</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <View style={styles.onlineToggle}>
            <Text style={[styles.onlineText, isOnline && styles.onlineActive]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: COLORS.gray, true: COLORS.success }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderStats()}
        {renderActiveDelivery()}
        {isOnline && renderAvailableOrders()}
        
        <View style={{ height: 50 }} />
      </ScrollView>
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  profileButtonLeft: { 
    width: 44, 
    height: 44, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 22,
    overflow: 'hidden'
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.dark, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: COLORS.gray, marginTop: 2, fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  onlineToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  onlineText: { marginRight: 8, fontSize: 14, color: COLORS.gray, fontWeight: '700' },
  onlineActive: { color: COLORS.success },
  
  content: { flex: 1 },
  section: { marginBottom: 20, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.dark, letterSpacing: -0.3 },
  
  badge: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  
  // Stats Section
  statsContainer: { gap: 12 },
  featuredCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  featuredCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  featuredLabel: { fontSize: 16, color: COLORS.darkGray, fontWeight: '600' },
  featuredValue: { fontSize: 36, fontWeight: '800', color: COLORS.primary, marginBottom: 12, letterSpacing: -1 },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniStatText: { fontSize: 13, color: COLORS.success, fontWeight: '600' },
  
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.dark, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.darkGray, fontWeight: '600', textAlign: 'center' },
  
  // Order Cards
  orderCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  orderBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  orderBadgeText: { color: COLORS.success, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  orderAmount: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  
  orderInfo: { gap: 12, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  infoContent: { flex: 1, justifyContent: 'center' },
  infoLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 15, color: COLORS.dark, fontWeight: '600', lineHeight: 20 },
  
  acceptButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  acceptButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  
  // Active Delivery
  activeDeliveryCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryLight
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  activeOrderId: { fontSize: 14, color: COLORS.gray, fontWeight: '600', marginBottom: 4 },
  activeOrderAmount: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  
  codBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6
  },
  codBadgeText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  
  progressContainer: { marginBottom: 20 },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3
  },
  progressText: { fontSize: 14, color: COLORS.darkGray, fontWeight: '600' },
  
  activeOrderInfo: { gap: 0, marginBottom: 20 },
  divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 12 },
  
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6
  },
  statusActive: { backgroundColor: COLORS.warningLight },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning
  },
  statusPillText: { fontSize: 12, fontWeight: '800', color: COLORS.warning, letterSpacing: 0.5 },
  
  actionButtonsContainer: { gap: 10 },
  navButtonLarge: {
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  navButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  
  statusButtonLarge: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  statusButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  
  completeButtonLarge: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  completeButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  
  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', lineHeight: 20 },
  
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Map Styles
  mapContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  map: {
    width: '100%',
    height: '100%'
  },
  riderMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  destinationMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark
  }
});
