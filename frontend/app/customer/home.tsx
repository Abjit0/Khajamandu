import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TextInput, Image, TouchableOpacity, Dimensions, Platform, FlatList, Modal, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/BottomNavBar'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
// Get full screen width
const { width } = Dimensions.get('window');
// Calculate banner width (Screen width - 40px padding) - FIXED BANNER SIZE
const BANNER_WIDTH = width - 40; 

// Define Colors
const COLORS = {
  primaryOrange: '#E6753A',
  backgroundCream: '#F8F4E9',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
  lightGray: '#E0E0E0',
};

// --- DATA: Banner Images (Food Discount & Offers) ---
const BANNERS = [
  { id: '1', uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop' },
  { id: '2', uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop' },
  { id: '3', uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=400&fit=crop' },
  { id: '4', uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop' }
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState('Thamel, Kathmandu');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [selectedAddressType, setSelectedAddressType] = useState<'home' | 'briefcase' | 'location'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([
    { id: '1', label: 'Home', address: 'Thamel, Kathmandu', icon: 'home' },
    { id: '2', label: 'Work', address: 'Durbar Marg, Kathmandu', icon: 'briefcase' },
    { id: '3', label: 'Other', address: 'New Baneshwor, Kathmandu', icon: 'location' },
  ]);

  const handleLocationSelect = (address: string) => {
    setCurrentLocation(address);
    setShowLocationModal(false);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setNewAddressLabel('');
    setNewAddressText('');
    setSelectedAddressType('home');
    setShowLocationModal(false);
    setShowAddAddressModal(true);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setNewAddressLabel(address.label);
    setNewAddressText(address.address);
    setSelectedAddressType(address.icon);
    setShowLocationModal(false);
    setShowAddAddressModal(true);
  };

  const handleSaveAddress = () => {
    if (!newAddressLabel.trim() || !newAddressText.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingAddress) {
      // Update existing address
      setSavedAddresses(prev =>
        prev.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, label: newAddressLabel, address: newAddressText, icon: selectedAddressType }
            : addr
        )
      );
      Alert.alert('Success', 'Address updated successfully');
    } else {
      // Add new address
      const newAddress = {
        id: Date.now().toString(),
        label: newAddressLabel,
        address: newAddressText,
        icon: selectedAddressType,
      };
      setSavedAddresses(prev => [...prev, newAddress]);
      Alert.alert('Success', 'Address added successfully');
    }

    setShowAddAddressModal(false);
    setShowLocationModal(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
            Alert.alert('Success', 'Address deleted successfully');
          },
        },
      ]
    );
  };

  const handleUseCurrentLocation = async () => {
    try {
      // Show loading state
      setCurrentLocation('Detecting location...');
      
      console.log('🔍 Requesting location permission...');
      
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      console.log('📍 Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to detect your current location. Please enable it in settings.',
          [{ text: 'OK' }]
        );
        setCurrentLocation('Thamel, Kathmandu'); // Reset to default
        return;
      }

      console.log('📡 Getting current position...');
      
      // Get current position with timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
      });

      console.log('✅ Location received:', location.coords);

      // Reverse geocode to get address
      console.log('🗺️ Reverse geocoding...');
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log('📍 Address data:', address);

      if (address && address.length > 0) {
        const addr = address[0];
        console.log('🏠 Address details:', addr);
        
        // Format the address nicely - try multiple combinations
        let formattedAddress = '';
        
        // Try to build address from available fields
        if (addr.name && !addr.name.includes('+')) {
          formattedAddress = addr.name;
        } else if (addr.street) {
          formattedAddress = addr.street;
        }
        
        // Add district/subregion
        if (addr.district) {
          formattedAddress += formattedAddress ? ', ' : '';
          formattedAddress += addr.district;
        } else if (addr.subregion) {
          formattedAddress += formattedAddress ? ', ' : '';
          formattedAddress += addr.subregion;
        }
        
        // Add city
        if (addr.city) {
          formattedAddress += formattedAddress ? ', ' : '';
          formattedAddress += addr.city;
        }
        
        // If still empty, try region or country
        if (!formattedAddress && addr.region) {
          formattedAddress = addr.region;
        }
        
        // Last resort: use coordinates
        if (!formattedAddress) {
          formattedAddress = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
        }
        
        console.log('✅ Formatted address:', formattedAddress);
        
        setCurrentLocation(formattedAddress);
        setShowLocationModal(false);
        
        Alert.alert(
          'Location Detected',
          `Your location: ${formattedAddress}`,
          [{ text: 'OK' }]
        );
      } else {
        // Fallback if reverse geocoding fails
        console.log('⚠️ No address data, using coordinates');
        const coordsAddress = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
        setCurrentLocation(coordsAddress);
        setShowLocationModal(false);
        
        Alert.alert(
          'Location Detected',
          `Coordinates: ${coordsAddress}`,
          [{ text: 'OK' }]
        );
      }
      
    } catch (error: any) {
      console.error('❌ Location error:', error);
      console.error('Error details:', error.message);
      
      Alert.alert(
        'Location Error',
        `Unable to detect your location: ${error.message}. Please try again or select from saved addresses.`,
        [{ text: 'OK' }]
      );
      setCurrentLocation('Thamel, Kathmandu'); // Reset to default
    }
  };

  // --- ALL RESTAURANTS DATA (for search) ---
  const ALL_RESTAURANTS = [
    { id: 'NPP Food Services', name: 'NPP Food Services', tags: 'Fast Food', location: 'Maharajgunj | Samakhushi', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop', rating: '4.2', price: 'Rs 655' },
    { id: 'The Bakery Cafe', name: 'The Bakery Cafe', tags: 'Cafe, Bakery', location: 'Thamel, Kathmandu', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop', rating: '4.6', price: 'Rs 800' },
    { id: 'Himalayan Java Coffee', name: 'Himalayan Java Coffee', tags: 'Coffee, Pastries', location: 'Durbar Marg, Kathmandu', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop', rating: '4.4', price: 'Rs 450' },
    { id: 'Fire and Ice Pizzeria', name: 'Fire and Ice Pizzeria', tags: 'Italian, Pizza', location: 'Thamel, Kathmandu', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop', rating: '4.7', price: 'Rs 1200' },
    { id: 'Dhokaima Cafe', name: 'Dhokaima Cafe', tags: 'Nepali, Traditional', location: 'Patan Dhoka, Lalitpur', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop', rating: '4.5', price: 'Rs 750' },
    { id: 'Roadhouse Cafe', name: 'Roadhouse Cafe', tags: 'Continental, Bar', location: 'Thamel, Kathmandu', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', rating: '4.3', price: 'Rs 950' },
    { id: 'Bhojan Griha', name: 'Bhojan Griha', tags: 'Nepali, Cultural', location: 'Dillibazar, Kathmandu', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop', rating: '4.6', price: 'Rs 850' },
    { id: 'Momo Kathmandu', name: 'Momo Kathmandu', tags: 'Nepali, Momo', location: 'Thamel, Kathmandu', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop', rating: '4.5', price: 'Rs 300' },
    { id: 'Pizza Hub', name: 'Pizza Hub', tags: 'Italian, Pizza', location: 'New Baneshwor, Kathmandu', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop', rating: '4.2', price: 'Rs 600' },
    { id: 'Burger House', name: 'Burger House', tags: 'Fast Food, Burgers', location: 'Lazimpat, Kathmandu', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', rating: '4.8', price: 'Rs 500' },
  ];

  const searchResults = searchQuery.trim().length > 0
    ? ALL_RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // --- AUTO-SCROLL LOGIC ---
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= BANNERS.length) {
        nextIndex = 0; 
      }

      // Scroll to the next "page" (which is exactly one screen width)
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      
      setActiveIndex(nextIndex);
    }, 3000); 

    return () => clearInterval(interval); 
  }, [activeIndex]);

  // Update dots when user swipes manually
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- 1. HEADER SECTION --- */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <Text style={styles.appTitle}>Khajamandu</Text>
          </View>

          {/* LOCATION SELECTOR */}
          <TouchableOpacity 
            style={styles.locationContainer} 
            onPress={() => setShowLocationModal(true)}
          >
            <View style={styles.locationLeft}>
              <Ionicons name="location" size={20} color={COLORS.primaryOrange} />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Deliver to</Text>
                <Text style={styles.locationText} numberOfLines={1}>{currentLocation}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={20} color={COLORS.textGray} />
          </TouchableOpacity>
          
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textGray} style={styles.searchIcon} />
            <TextInput 
              placeholder="Search for restaurants or dishes" 
              placeholderTextColor={COLORS.textGray}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.textGray} />
              </TouchableOpacity>
            )}
          </View>

          {/* SEARCH RESULTS DROPDOWN */}
          {searchQuery.trim().length > 0 && (
            <View style={styles.searchDropdown}>
              {/* Header */}
              <View style={styles.searchDropdownHeader}>
                <Text style={styles.searchDropdownTitle}>
                  {searchResults.length > 0 ? `${searchResults.length} result${searchResults.length > 1 ? 's' : ''}` : 'No results'}
                </Text>
              </View>

              {searchResults.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={36} color="#DDD" />
                  <Text style={styles.noResultsTitle}>No restaurants found</Text>
                  <Text style={styles.noResultsSubtitle}>Try searching for "Pizza", "Momo" or "Cafe"</Text>
                </View>
              ) : (
                searchResults.map((r, index) => (
                  <TouchableOpacity
                    key={r.id}
                    style={[
                      styles.searchResultRow,
                      index < searchResults.length - 1 && styles.searchResultBorder
                    ]}
                    onPress={() => {
                      setSearchQuery('');
                      router.push({
                        pathname: '/restaurant/[id]',
                        params: { id: r.id, image: r.image, location: r.location, rating: r.rating }
                      } as any);
                    }}
                    activeOpacity={0.7}
                  >
                    {/* Thumbnail */}
                    <Image
                      source={{ uri: r.image }}
                      style={styles.searchResultThumb}
                    />
                    {/* Info */}
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName} numberOfLines={1}>{r.name}</Text>
                      <Text style={styles.searchResultTags} numberOfLines={1}>{r.tags}</Text>
                      <View style={styles.searchResultBottom}>
                        <Ionicons name="location-outline" size={11} color={COLORS.textGray} />
                        <Text style={styles.searchResultLocation} numberOfLines={1}>{r.location}</Text>
                      </View>
                    </View>
                    {/* Rating + Arrow */}
                    <View style={styles.searchResultRight}>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={10} color="#FFD700" />
                        <Text style={styles.ratingText}>{r.rating}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#CCC" style={{ marginTop: 6 }} />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* TOP CATEGORIES */}
          <View style={styles.topCategories}>
            <TopCategoryItem 
                title="All Restaurant" 
                iconName="fast-food" 
                onPress={() => router.push('/category/all' as any)} 
            />
            <TopCategoryItem 
                title="Offers" 
                iconName="ticket" 
                onPress={() => router.push('/category/offers' as any)} 
            />
            <TopCategoryItem 
                title="Taste Beyond" 
                iconName="trophy" 
                onPress={() => router.push('/category/taste-beyond' as any)} 
            />
            <TopCategoryItem 
                title="Hot Deals" 
                iconName="flame" 
                onPress={() => router.push('/category/hot-deals' as any)} 
            />
          </View>
        </View>

        {/* --- 2. BANNER SLIDER (PERFECT SNAP) --- */}
        <View style={styles.bannerContainer}>
            <FlatList
              ref={flatListRef}
              data={BANNERS}
              horizontal
              pagingEnabled={true} // This forces the list to snap to screen width
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              // The Wrapper is full width, the image inside has margins
              renderItem={({ item }) => (
                <View style={{ width: width, alignItems: 'center', justifyContent: 'center' }}> 
                  <Image 
                    source={{ uri: item.uri }} 
                    style={styles.bannerImage} 
                    resizeMode="cover"
                  />
                </View>
              )}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
            />

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {BANNERS.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    { backgroundColor: index === activeIndex ? COLORS.primaryOrange : COLORS.lightGray }
                  ]} 
                />
              ))}
            </View>
        </View>

        {/* --- 3. WHAT'S ON YOUR MIND (ADDED MORE ITEMS) --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What's on your mind today?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            <FoodCircleItem 
                title="Pizza" 
                imageUri="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" 
                onPress={() => router.push('/category/pizza' as any)}
            />
            <FoodCircleItem 
                title="Burger" 
                imageUri="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" 
                onPress={() => router.push('/category/burger' as any)}
            />
            <FoodCircleItem 
                title="Momo" 
                imageUri="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop" 
                onPress={() => router.push('/category/momo' as any)}
            />
            <FoodCircleItem title="Biryani" imageUri="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Sushi" imageUri="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Fried Chicken" imageUri="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Pasta" imageUri="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Noodles" imageUri="https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Dessert" imageUri="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Coffee" imageUri="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Tacos" imageUri="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Sandwich" imageUri="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Ramen" imageUri="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Salad" imageUri="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Smoothie" imageUri="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Donuts" imageUri="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Wraps" imageUri="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop" />
          </ScrollView>
        </View>

        {/* --- 4. FEATURED RESTAURANTS --- */}
        <View style={styles.sectionContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              <FeaturedCard 
                title="Momo Kathmandu"
                imageUri="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&h=400&fit=crop"
                rating="4.5"
              />
              <FeaturedCard 
                title="Pizza Hub"
                imageUri="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=400&fit=crop"
                rating="4.2"
              />
               <FeaturedCard 
                title="Burger House"
                imageUri="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=400&fit=crop"
                rating="4.8"
              />
           </ScrollView>
        </View>

        {/* --- 5. TASTE BEYOND TIME (ADDED MORE ITEMS) --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
             <Text style={styles.sectionTitle}>Taste Beyond Time</Text>
             <Ionicons name="star" size={16} color="#FFD700" />
          </View>
          <Text style={styles.sectionSubtitle}>Long-standing icons of the culinary scene</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            <FoodCircleItem title="Trisara" imageUri="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Bhumi" imageUri="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Bajeko" imageUri="https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Jimbu Thakali" imageUri="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Roadhouse" imageUri="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Himalayan Java" imageUri="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Dalle" imageUri="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop" />
            <FoodCircleItem title="KFC" imageUri="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop" />
            <FoodCircleItem title="Fire & Ice" imageUri="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" />
          </ScrollView>
        </View>

        {/* --- 6. THE USUALS --- */}
        <View style={[styles.sectionContainer, { marginBottom: 80 }]}> 
          <Text style={styles.sectionTitle}>The Usuals You'll Love</Text>
          <Text style={styles.sectionSubtitle}>If it's not already your favourite, it's about to be</Text>
          
          <VerticalRestaurantCard 
            name="NPP Food Services"
            tags="Fast Food"
            location="Maharajgunj | Samakhushi"
            imageUri="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop"
            price="Rs 655"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'NPP Food Services',
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
                location: 'Maharajgunj | Samakhushi',
                rating: '4.2'
              }
            } as any)}
          />
           <VerticalRestaurantCard 
            name="The Bakery Cafe"
            tags="Cafe, Bakery"
            location="Thamel, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop"
            price="Rs 800"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'The Bakery Cafe',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
                location: 'Thamel, Kathmandu',
                rating: '4.6'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Himalayan Java Coffee"
            tags="Coffee, Pastries"
            location="Durbar Marg, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop"
            price="Rs 450"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Himalayan Java Coffee',
                image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
                location: 'Durbar Marg, Kathmandu',
                rating: '4.4'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Fire and Ice Pizzeria"
            tags="Italian, Pizza"
            location="Thamel, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop"
            price="Rs 1200"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Fire and Ice Pizzeria',
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
                location: 'Thamel, Kathmandu',
                rating: '4.7'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Dhokaima Cafe"
            tags="Nepali, Traditional"
            location="Patan Dhoka, Lalitpur"
            imageUri="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
            price="Rs 750"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Dhokaima Cafe',
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
                location: 'Patan Dhoka, Lalitpur',
                rating: '4.5'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Roadhouse Cafe"
            tags="Continental, Bar"
            location="Thamel, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
            price="Rs 950"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Roadhouse Cafe',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
                location: 'Thamel, Kathmandu',
                rating: '4.3'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Bhojan Griha"
            tags="Nepali, Cultural"
            location="Dillibazar, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop"
            price="Rs 1800"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Bhojan Griha',
                image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
                location: 'Dillibazar, Kathmandu',
                rating: '4.8'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Garden of Dreams Cafe"
            tags="Cafe, Garden Dining"
            location="Thamel, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop"
            price="Rs 650"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Garden of Dreams Cafe',
                image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop',
                location: 'Thamel, Kathmandu',
                rating: '4.4'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Momo Station"
            tags="Momo, Tibetan"
            location="New Baneshwor, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop"
            price="Rs 350"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Momo Station',
                image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop',
                location: 'New Baneshwor, Kathmandu',
                rating: '4.1'
              }
            } as any)}
          />
          <VerticalRestaurantCard 
            name="Bluebird Mall Food Court"
            tags="Multi-cuisine, Fast Food"
            location="Tripureshwor, Kathmandu"
            imageUri="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop"
            price="Rs 500"
            onPress={() => router.push({
              pathname: '/restaurant/[id]',
              params: { 
                id: 'Bluebird Mall Food Court',
                image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
                location: 'Tripureshwor, Kathmandu',
                rating: '3.9'
              }
            } as any)}
          />
        </View>

      </ScrollView>

      {/* --- LOCATION MODAL --- */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {/* Use Current Location */}
            <TouchableOpacity 
              style={styles.currentLocationButton}
              onPress={handleUseCurrentLocation}
            >
              <View style={styles.locationIconContainer}>
                <Ionicons name="navigate" size={20} color={COLORS.primaryOrange} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>Use Current Location</Text>
                <Text style={styles.locationSubtitle}>Enable GPS to detect location</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Saved Addresses */}
            <Text style={styles.savedAddressesTitle}>Saved Addresses</Text>
            <ScrollView style={styles.addressList}>
              {savedAddresses.map((item) => (
                <View key={item.id} style={styles.addressItemContainer}>
                  <TouchableOpacity
                    style={styles.addressItem}
                    onPress={() => handleLocationSelect(item.address)}
                  >
                    <View style={styles.locationIconContainer}>
                      <Ionicons name={item.icon as any} size={20} color={COLORS.primaryOrange} />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationTitle}>{item.label}</Text>
                      <Text style={styles.locationSubtitle}>{item.address}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
                  </TouchableOpacity>
                  
                  {/* Edit and Delete Buttons */}
                  <View style={styles.addressActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditAddress(item)}
                    >
                      <Ionicons name="pencil" size={16} color={COLORS.primaryOrange} />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteAddress(item.id)}
                    >
                      <Ionicons name="trash" size={16} color="#EF4444" />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Add New Address Button */}
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={handleAddNewAddress}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.primaryOrange} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- ADD/EDIT ADDRESS MODAL --- */}
      <Modal
        visible={showAddAddressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddAddressModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Address Type Selection */}
              <Text style={styles.formLabel}>Address Type</Text>
              <View style={styles.addressTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.addressTypeButton,
                    selectedAddressType === 'home' && styles.addressTypeButtonActive,
                  ]}
                  onPress={() => setSelectedAddressType('home')}
                >
                  <Ionicons
                    name="home"
                    size={24}
                    color={selectedAddressType === 'home' ? COLORS.white : COLORS.primaryOrange}
                  />
                  <Text
                    style={[
                      styles.addressTypeText,
                      selectedAddressType === 'home' && styles.addressTypeTextActive,
                    ]}
                  >
                    Home
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addressTypeButton,
                    selectedAddressType === 'briefcase' && styles.addressTypeButtonActive,
                  ]}
                  onPress={() => setSelectedAddressType('briefcase')}
                >
                  <Ionicons
                    name="briefcase"
                    size={24}
                    color={selectedAddressType === 'briefcase' ? COLORS.white : COLORS.primaryOrange}
                  />
                  <Text
                    style={[
                      styles.addressTypeText,
                      selectedAddressType === 'briefcase' && styles.addressTypeTextActive,
                    ]}
                  >
                    Work
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addressTypeButton,
                    selectedAddressType === 'location' && styles.addressTypeButtonActive,
                  ]}
                  onPress={() => setSelectedAddressType('location')}
                >
                  <Ionicons
                    name="location"
                    size={24}
                    color={selectedAddressType === 'location' ? COLORS.white : COLORS.primaryOrange}
                  />
                  <Text
                    style={[
                      styles.addressTypeText,
                      selectedAddressType === 'location' && styles.addressTypeTextActive,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Label Input */}
              <Text style={styles.formLabel}>Label</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Home, Office, Friend's Place"
                placeholderTextColor={COLORS.textGray}
                value={newAddressLabel}
                onChangeText={setNewAddressLabel}
              />

              {/* Address Input */}
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Enter full address"
                placeholderTextColor={COLORS.textGray}
                value={newAddressText}
                onChangeText={setNewAddressText}
                multiline
                numberOfLines={3}
              />

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                <Text style={styles.saveButtonText}>
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- 7. BOTTOM NAVIGATION BAR --- */}
      <BottomNavBar />

    </SafeAreaView>
  );
}

// --- HELPERS ---

interface TopCategoryItemProps {
  title: string;
  iconName: any;
  onPress?: () => void;
}
const TopCategoryItem = ({ title, iconName, onPress }: TopCategoryItemProps) => (
  <TouchableOpacity style={{ alignItems: 'center' }} onPress={onPress}>
    <View style={styles.topIconContainer}>
      <Ionicons name={iconName} size={24} color={COLORS.primaryOrange} />
    </View>
    <Text style={styles.topIconText}>{title}</Text>
  </TouchableOpacity>
);

interface FoodCircleItemProps {
  title: string;
  imageUri?: string;
  icon?: any;
  onPress?: () => void;
}
const FoodCircleItem = ({ title, imageUri, icon, onPress }: FoodCircleItemProps) => (
    <TouchableOpacity style={{ marginRight: 15, alignItems: 'center' }} onPress={onPress}>
      <View style={styles.circleImageContainer}>
        {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
        ) : (
            <Ionicons name={icon} size={24} color={COLORS.textGray} />
        )}
      </View>
      <Text style={styles.circleText}>{title}</Text>
    </TouchableOpacity>
);

interface FeaturedCardProps {
  title: string;
  imageUri: string;
  rating: string;
}
const FeaturedCard = ({ title, imageUri, rating }: FeaturedCardProps) => (
    <TouchableOpacity style={styles.featuredCard}>
        <Image source={{ uri: imageUri }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
            <Text style={styles.featuredTitle}>{title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={{ color: 'white', fontSize: 12, marginLeft: 4 }}>{rating}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

interface VerticalRestaurantCardProps {
  name: string;
  tags: string;
  location: string;
  imageUri: string;
  price: string;
  onPress?: () => void;
}
const VerticalRestaurantCard = ({ name, tags, location, imageUri, price, onPress }: VerticalRestaurantCardProps) => (
    <TouchableOpacity style={styles.verticalCard} onPress={onPress}>
        <Image source={{ uri: imageUri }} style={styles.verticalImage} />
        <View style={styles.priceTag}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{price}</Text>
        </View>
        <View style={{ padding: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.textDark }}>{name}</Text>
            <Text style={{ color: COLORS.textGray, fontSize: 12, marginVertical: 2 }}>{tags}</Text>
            <Text style={{ color: COLORS.textGray, fontSize: 11 }}>{location}</Text>
        </View>
    </TouchableOpacity>
);

// --- STYLES ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundCream },
  scrollContent: { flexGrow: 1, paddingBottom: 80 },
  
  headerContainer: {
    backgroundColor: COLORS.primaryOrange,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    marginBottom: 15,
  },
  appTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: COLORS.white, 
    textAlign: 'center',
  },
  
  // Location Selector Styles
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  locationText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '600',
    marginTop: 2,
  },
  
  searchBar: {
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: 30,
    paddingHorizontal: 15, 
    alignItems: 'center', 
    height: 50, 
    marginBottom: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: COLORS.textDark },

  // Search dropdown
  searchDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  searchDropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FAFAFA',
  },
  searchDropdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchResultBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  searchResultThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  searchResultTags: {
    fontSize: 12,
    color: COLORS.primaryOrange,
    fontWeight: '500',
    marginBottom: 3,
  },
  searchResultBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  searchResultLocation: {
    fontSize: 11,
    color: COLORS.textGray,
  },
  searchResultRight: {
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },
  noResultsSubtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    marginTop: 4,
    textAlign: 'center',
  },
  topCategories: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  topIconContainer: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center', marginBottom: 5,
  },
  topIconText: { fontSize: 11, color: COLORS.white, fontWeight: '500' },

  // --- BANNER STYLES FIXED ---
  bannerContainer: { marginTop: 20, alignItems: 'center' },
  // Image takes full width minus 40px padding
  bannerImage: { width: BANNER_WIDTH, height: 180, borderRadius: 16 }, 
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },

  sectionContainer: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 5 },
  sectionSubtitle: { fontSize: 12, color: COLORS.textGray, marginBottom: 15 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  horizontalList: { paddingVertical: 5 },

  circleImageContainer: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.white,
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 5,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
  },
  circleText: { fontSize: 12, color: COLORS.textDark },

  featuredCard: {
    width: 140, height: 180, borderRadius: 12, overflow: 'hidden', marginRight: 15,
    backgroundColor: COLORS.white, elevation: 3
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', padding: 10
  },
  featuredTitle: { color: 'white', fontWeight: 'bold', marginBottom: 3 },

  verticalCard: {
    backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 20,
    overflow: 'hidden', elevation: 2
  },
  verticalImage: { width: '100%', height: 180 },
  priceTag: {
    position: 'absolute', top: 140, left: 10, backgroundColor: COLORS.primaryOrange,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.backgroundCream,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  locationSubtitle: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: COLORS.textGray,
    fontWeight: '600',
  },
  savedAddressesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  addressList: {
    paddingHorizontal: 20,
    maxHeight: 250,
  },
  addressItemContainer: {
    marginBottom: 10,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundCream,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.backgroundCream,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryOrange,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryOrange,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryOrange,
    marginLeft: 8,
  },
  
  // Add/Edit Address Form Styles
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
    marginTop: 15,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: COLORS.backgroundCream,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  addressTypeButtonActive: {
    backgroundColor: COLORS.primaryOrange,
    borderColor: COLORS.primaryOrange,
  },
  addressTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryOrange,
    marginTop: 5,
  },
  addressTypeTextActive: {
    color: COLORS.white,
  },
  formInput: {
    backgroundColor: COLORS.backgroundCream,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: COLORS.primaryOrange,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
