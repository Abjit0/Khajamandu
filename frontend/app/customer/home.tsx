import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TextInput, Image, TouchableOpacity, Dimensions, Platform, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/BottomNavBar'; 
import { SafeAreaView } from 'react-native-safe-area-context';
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
          <Text style={styles.appTitle}>Khajamandu</Text>
          
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textGray} style={styles.searchIcon} />
            <TextInput 
              placeholder="Search" 
              placeholderTextColor={COLORS.textGray}
              style={styles.searchInput}
            />
          </View>

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
  appTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, textAlign: 'center', marginBottom: 20 },
  searchBar: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 30,
    paddingHorizontal: 15, alignItems: 'center', height: 50, marginBottom: 25,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: COLORS.textDark },
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
});