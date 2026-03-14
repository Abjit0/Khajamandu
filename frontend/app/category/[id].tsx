import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  Image, TouchableOpacity, Dimensions, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavBar from '../../components/BottomNavBar'; 
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#E6753A',
  backgroundCream: '#F8F4E9',
  textDark: '#2D2D2D',
  textGray: '#8A8A8A',
  white: '#FFFFFF',
};

// 1. Define Types
interface Restaurant {
  name: string;
  location: string;
  rating: string;
  time: string;
  offer: string;
  logo: string; 
}

interface CategoryData {
  title: string;
  banner: string;
  restaurants: Restaurant[];
}

// 2. RICH DATA 
const DATA: Record<string, CategoryData> = {
  'all': {
    title: 'All Restaurants',
    banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    restaurants: [
      { name: 'Batuki Momo Station', location: 'Jalpa Chowk', rating: '4.5', time: '30 mins', offer: '', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
      { name: 'Chicken Station', location: 'Machha Pokhari', rating: '4.2', time: '25 mins', offer: 'Free Coke', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop' },
      { name: 'Pizza Hut', location: 'Samakhushi', rating: '4.5', time: '40 mins', offer: '', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'Burger House', location: 'New Baneshwor', rating: '4.8', time: '35 mins', offer: '15% OFF', logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
      { name: 'Himalayan Java', location: 'Civil Mall', rating: '4.6', time: '20 mins', offer: '', logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
      { name: 'Fire And Ice Pizzeria', location: 'Thamel', rating: '4.7', time: '45 mins', offer: 'Free Delivery', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'Roadhouse Cafe', location: 'Boudha', rating: '4.4', time: '50 mins', offer: '', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
      { name: 'Dalle Momo', location: 'Kamaladi', rating: '4.3', time: '30 mins', offer: 'Spicy Deal', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
      { name: 'KFC Nepal', location: 'Durbar Marg', rating: '4.1', time: '25 mins', offer: 'Meal Box', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop' },
      { name: 'Bota Simply Momo', location: 'Kumaripati', rating: '4.0', time: '35 mins', offer: '', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
      { name: 'Dhokaima Cafe', location: 'Patan Dhoka', rating: '4.5', time: '40 mins', offer: 'Traditional', logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop' },
      { name: 'Garden of Dreams Cafe', location: 'Thamel', rating: '4.4', time: '30 mins', offer: '', logo: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=200&h=200&fit=crop' },
      { name: 'Bhojan Griha', location: 'Dillibazar', rating: '4.8', time: '60 mins', offer: 'Cultural Dining', logo: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=200&fit=crop' },
      { name: 'Momo Station', location: 'New Baneshwor', rating: '4.1', time: '20 mins', offer: '', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
      { name: 'Bluebird Mall Food Court', location: 'Tripureshwor', rating: '3.9', time: '25 mins', offer: 'Multi-cuisine', logo: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=200&h=200&fit=crop' },
      { name: 'The Bakery Cafe', location: 'Thamel', rating: '4.6', time: '30 mins', offer: '', logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
      { name: 'Nanglo Restaurant', location: 'Durbar Marg', rating: '4.3', time: '35 mins', offer: '', logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop' },
      { name: 'Chopstix', location: 'Lazimpat', rating: '4.2', time: '30 mins', offer: 'Chinese', logo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop' },
    ]
  },
  'offers': {
    title: 'Restaurant Offers',
    banner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    restaurants: [
      { name: 'Burger House', location: 'Thamel', rating: '4.8', time: '25 mins', offer: 'Flat 50% OFF', logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
      { name: 'Batuki Momo', location: 'Baniyatar', rating: '4.5', time: '30 mins', offer: 'Buy 1 Get 1', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
      { name: 'Crunchy Fried Chicken', location: 'Gongabu', rating: '4.0', time: '20 mins', offer: 'Combo @ 999', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop' },
      { name: 'Pizza World', location: 'Kalanki', rating: '3.9', time: '40 mins', offer: 'Free Coke', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'Valley Cold Store', location: 'Balaju', rating: '4.2', time: '15 mins', offer: '10% Cashback', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop' },
      { name: 'Sandwich Point', location: 'Thamel', rating: '4.3', time: '25 mins', offer: 'BOGO Deal', logo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop' },
      { name: 'Biryani Adda', location: 'Putalisadak', rating: '4.4', time: '35 mins', offer: 'Family Pack', logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
      { name: 'Himalayan Java', location: 'Durbar Marg', rating: '4.6', time: '20 mins', offer: '20% OFF Coffee', logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
      { name: 'The Bakery Cafe', location: 'Thamel', rating: '4.6', time: '30 mins', offer: 'Free Pastry', logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
      { name: 'Momo Magic', location: 'Basantapur', rating: '4.3', time: '25 mins', offer: 'Platter @ 499', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
      { name: 'Noodle House', location: 'Jhamsikhel', rating: '4.1', time: '30 mins', offer: 'Buy 2 Get 1', logo: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop' },
      { name: 'Chopstix', location: 'Lazimpat', rating: '4.2', time: '30 mins', offer: '15% OFF', logo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop' },
      { name: 'Fire And Ice', location: 'Thamel', rating: '4.7', time: '45 mins', offer: 'Free Delivery', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
    ]
  },
  'taste-beyond': {
    title: 'Legendary Restaurants',
    banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    restaurants: [
      { name: 'Trisara', location: 'Lazimpat', rating: '4.9', time: 'Since 2011', offer: 'Fine Dining', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
      { name: 'Bhumi Restaurant', location: 'Lazimpat', rating: '4.7', time: 'Since 2009', offer: 'Newari Set', logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop' },
      { name: 'Bajeko Sekuwa', location: 'Battisputali', rating: '4.6', time: 'Since 1990', offer: 'Authentic BBQ', logo: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=200&fit=crop' },
      { name: 'Jimbu Thakali', location: 'Tangal', rating: '4.8', time: 'Famous Thakali', offer: '', logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop' },
      { name: 'Fire And Ice', location: 'Thamel', rating: '4.8', time: 'Since 1995', offer: 'Italian', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'Chez Caroline', location: 'Baber Mahal', rating: '4.9', time: 'French Cuisine', offer: '', logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop' },
      { name: 'Old House', location: 'Durbar Marg', rating: '4.7', time: 'Heritage', offer: '', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
      { name: 'Bhojan Griha', location: 'Dillibazar', rating: '4.8', time: 'Since 1998', offer: 'Cultural Show', logo: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=200&fit=crop' },
      { name: 'Krishnarpan', location: 'Dwarika Hotel', rating: '4.9', time: 'Fine Dining', offer: 'Authentic', logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop' },
      { name: 'Dhokaima Cafe', location: 'Patan Dhoka', rating: '4.5', time: 'Since 2005', offer: 'Traditional', logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop' },
      { name: 'Roadhouse Cafe', location: 'Thamel', rating: '4.4', time: 'Since 2000', offer: 'Continental', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
      { name: 'Nanglo Restaurant', location: 'Durbar Marg', rating: '4.3', time: 'Since 1997', offer: 'Nepali', logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop' },
    ]
  },
  'hot-deals': {
    title: 'Hot Deals',
    banner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    restaurants: [
      { name: 'Chicken Station', location: 'Thamel', rating: '4.5', time: '15 mins', offer: 'Combo @ 999', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop' },
      { name: 'Pizza Hut', location: 'Durbar Marg', rating: '4.2', time: '45 mins', offer: 'Family Meal Deal', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'KKFC', location: 'New Road', rating: '4.1', time: '20 mins', offer: 'Bucket Saver', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop' },
      { name: 'Momo Magic', location: 'Basantapur', rating: '4.3', time: '25 mins', offer: 'Platter Deal', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
      { name: 'Noodle Box', location: 'Jhamsikhel', rating: '4.0', time: '30 mins', offer: 'Buy 2 Get 1', logo: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200&h=200&fit=crop' },
      { name: 'Taco Bell', location: 'Thamel', rating: '4.4', time: '20 mins', offer: 'Taco Tuesday', logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop' },
      { name: 'Burger House', location: 'New Baneshwor', rating: '4.8', time: '25 mins', offer: '50% OFF', logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
      { name: 'Biryani Adda', location: 'Putalisadak', rating: '4.4', time: '35 mins', offer: 'Family Pack @ 1999', logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
      { name: 'Sandwich Point', location: 'Thamel', rating: '4.3', time: '25 mins', offer: 'BOGO', logo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop' },
      { name: 'Valley Cold Store', location: 'Balaju', rating: '4.2', time: '15 mins', offer: '10% Cashback', logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&h=200&fit=crop' },
      { name: 'The Bakery Cafe', location: 'Thamel', rating: '4.6', time: '30 mins', offer: 'Free Pastry', logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
      { name: 'Dalle Momo', location: 'Kamaladi', rating: '4.3', time: '30 mins', offer: 'Spicy Deal @ 399', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
    ]
  },
  'pizza': {
    title: 'Pizza Places',
    banner: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
    restaurants: [
      { name: 'Wood Fire House', location: 'Baniyatar', rating: '4.5', time: '30 mins', offer: 'Buy 1 Get 1', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'Fire And Ice', location: 'Thamel', rating: '4.8', time: '45 mins', offer: 'Authentic', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'Roadhouse', location: 'Boudha', rating: '4.6', time: '40 mins', offer: '', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
      { name: 'Pizza World', location: 'Kalanki', rating: '4.0', time: '35 mins', offer: '20% Off', logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
    ]
  },
  'burger': {
    title: 'Burger Joints',
    banner: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
    restaurants: [
      { name: 'Burger House', location: 'New Baneshwor', rating: '4.8', time: '25 mins', offer: 'Free Coke', logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
      { name: 'Crunchy Burger', location: 'Lazimpat', rating: '4.2', time: '30 mins', offer: '', logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
      { name: 'Workshop Eatery', location: 'Kupondole', rating: '4.7', time: '40 mins', offer: 'Gourmet', logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
    ]
  },
  'default': {
    title: 'Restaurants',
    banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    restaurants: [
      { name: 'Kathmandu Kitchen', location: 'City Center', rating: '4.3', time: '35 mins', offer: 'Free Delivery', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' }
    ]
  }
};

export default function CategoryListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  // Safe Key Lookup
  const key = typeof id === 'string' ? id.toLowerCase() : 'default';
  const pageData = DATA[key] || DATA.default;
  const pageTitle = pageData.title;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>{pageTitle}</Text>
            <Text style={styles.headerSubtitle}>Explore best options</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <Image source={{ uri: pageData.banner }} style={styles.bannerImage} resizeMode="cover" />

        {/* LIST */}
        <View style={styles.listContainer}>
            {pageData.restaurants.map((item, index) => (
                <RestaurantCard key={index} data={item} />
            ))}
        </View>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

// --- CARD COMPONENT (UPDATED STEP 1) ---
const RestaurantCard = ({ data }: { data: Restaurant }) => {
  // ✅ 1. Get the router
  const router = useRouter();

  return (
    // ✅ 2. Wrap in TouchableOpacity and add onPress logic
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => {
        router.push({
          pathname: '/restaurant/[id]', // Navigate to the menu page
          params: { 
            id: data.name,       // Send the Name as ID
            image: data.logo,    // Send Image
            location: data.location,
            rating: data.rating
          } 
        });
      }}
    >
      <View style={styles.cardContainer}>
        {/* Left: Food Image */}
        <View style={styles.logoContainer}>
            <Image source={{ uri: data.logo }} style={styles.logo} resizeMode="cover" />
        </View>
        
        {/* Right: Info */}
        <View style={styles.cardContent}>
            <Text style={styles.resName} numberOfLines={1}>{data.name}</Text>
            <Text style={styles.resLocation}>{data.location}</Text>
            
            <View style={styles.rowInfo}>
                <Ionicons name="star" size={14} color={COLORS.primaryOrange} />
                <Text style={styles.ratingText}>{data.rating}</Text>
                <Text style={styles.pipe}>|</Text>
                <Text style={styles.deliveryText}>{data.time}</Text>
            </View>

            {data.offer ? (
                <View style={styles.rowInfo}>
                    <MaterialCommunityIcons name="gift-outline" size={14} color={COLORS.primaryOrange} />
                    <Text style={styles.offerText}>{data.offer}</Text>
                </View>
            ) : null}
        </View>
        
        {/* Heart Icon */}
        <TouchableOpacity style={{ padding: 5 }}>
            <Ionicons name="heart-outline" size={24} color={COLORS.textGray} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundCream },
  scrollContent: { flexGrow: 1, paddingBottom: 80 },
  headerContainer: {
    backgroundColor: COLORS.primaryOrange,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 20,
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: 12, color: COLORS.white, opacity: 0.9 },
  bannerImage: { width: width, height: 180 },
  listContainer: { padding: 15, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center'
  },
  logoContainer: { marginRight: 15 },
  logo: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#eee' }, 
  cardContent: { flex: 1 },
  resName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  resLocation: { fontSize: 13, color: COLORS.textGray, marginBottom: 4 },
  rowInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textDark, marginLeft: 4 },
  pipe: { marginHorizontal: 8, color: COLORS.textGray },
  deliveryText: { fontSize: 12, color: COLORS.textGray },
  offerText: { fontSize: 12, color: COLORS.primaryOrange, marginLeft: 4, fontWeight: '600' },
});