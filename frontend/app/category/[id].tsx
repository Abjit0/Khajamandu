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
    banner: 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg',
    restaurants: [
      { name: 'Batuki Momo Station', location: 'Jalpa Chowk', rating: '4.5', time: '30 mins', offer: '', logo: 'https://img.freepik.com/free-photo/dumplings-wooden-board_140725-776.jpg' },
      { name: 'Chicken Station', location: 'Machha Pokhari', rating: '4.2', time: '25 mins', offer: 'Free Coke', logo: 'https://img.freepik.com/free-photo/fried-chicken-leg-with-fries_140725-5028.jpg' },
      { name: 'Pizza Hut', location: 'Samakhushi', rating: '4.5', time: '40 mins', offer: '', logo: 'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg' },
      { name: 'Burger House', location: 'New Baneshwor', rating: '4.8', time: '35 mins', offer: '15% OFF', logo: 'https://img.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg' },
      { name: 'Himalayan Java', location: 'Civil Mall', rating: '4.6', time: '20 mins', offer: '', logo: 'https://img.freepik.com/free-photo/latte-art-coffee-cup-cafe_140725-667.jpg' },
      { name: 'Fire And Ice Pizzeria', location: 'Thamel', rating: '4.7', time: '45 mins', offer: 'Free Delivery', logo: 'https://img.freepik.com/free-photo/freshly-baked-pizza-with-cut-slice_140725-23.jpg' },
      { name: 'Roadhouse Cafe', location: 'Boudha', rating: '4.4', time: '50 mins', offer: '', logo: 'https://img.freepik.com/free-photo/delicious-italian-pizza-with-tomato-olives-pepperoni_140725-1317.jpg' },
      { name: 'Dalle Momo', location: 'Kamaladi', rating: '4.3', time: '30 mins', offer: 'Spicy Deal', logo: 'https://img.freepik.com/free-photo/steamed-dumplings-dim-sum_1339-1296.jpg' },
      { name: 'KFC Nepal', location: 'Durbar Marg', rating: '4.1', time: '25 mins', offer: 'Meal Box', logo: 'https://img.freepik.com/free-photo/crispy-fried-chicken-plate-with-salad-carrot_1150-20212.jpg' },
      { name: 'Bota Simply Momo', location: 'Kumaripati', rating: '4.0', time: '35 mins', offer: '', logo: 'https://img.freepik.com/free-photo/gyoza-dumplings-with-vegetables_140725-2636.jpg' },
    ]
  },
  'offers': {
    title: 'Restaurant Offers',
    banner: 'https://img.freepik.com/free-vector/flat-design-food-sale-background_23-2149113942.jpg',
    restaurants: [
      { name: 'Burger House', location: 'Thamel', rating: '4.8', time: '25 mins', offer: 'Flat 50% OFF', logo: 'https://img.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg' },
      { name: 'Batuki Momo', location: 'Baniyatar', rating: '4.5', time: '30 mins', offer: 'Buy 1 Get 1', logo: 'https://img.freepik.com/free-photo/dumplings-wooden-board_140725-776.jpg' },
      { name: 'Crunchy Fried Chicken', location: 'Gongabu', rating: '4.0', time: '20 mins', offer: 'Combo @ 999', logo: 'https://img.freepik.com/free-photo/fried-chicken-leg-with-fries_140725-5028.jpg' },
      { name: 'Pizza World', location: 'Kalanki', rating: '3.9', time: '40 mins', offer: 'Free Coke', logo: 'https://img.freepik.com/free-photo/pizza-time-tasty-homemade-traditional-pizza-italian-recipe_144627-42528.jpg' },
      { name: 'Valley Cold Store', location: 'Balaju', rating: '4.2', time: '15 mins', offer: '10% Cashback', logo: 'https://img.freepik.com/free-photo/raw-chicken-meat_144627-31229.jpg' },
      { name: 'Sandwich Point', location: 'Thamel', rating: '4.3', time: '25 mins', offer: 'BOGO Deal', logo: 'https://img.freepik.com/free-photo/club-sandwich-with-side-french-fries_140725-1744.jpg' },
      { name: 'Biryani Adda', location: 'Putalisadak', rating: '4.4', time: '35 mins', offer: 'Family Pack', logo: 'https://img.freepik.com/free-photo/gourmet-chicken-biryani-with-steamed-basmati-rice-generated-by-ai_188544-13480.jpg' },
    ]
  },
  'taste-beyond': {
    title: 'Legendary Restaurants',
    banner: 'https://img.freepik.com/free-photo/delicious-indian-food-tray_23-2148723505.jpg',
    restaurants: [
      { name: 'Trisara', location: 'Lazimpat', rating: '4.9', time: 'Since 2011', offer: 'Fine Dining', logo: 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg' },
      { name: 'Bhumi Restaurant', location: 'Lazimpat', rating: '4.7', time: 'Since 2009', offer: 'Newari Set', logo: 'https://img.freepik.com/free-photo/delicious-indian-food-tray_23-2148723505.jpg' },
      { name: 'Bajeko Sekuwa', location: 'Battisputali', rating: '4.6', time: 'Since 1990', offer: 'Authentic BBQ', logo: 'https://img.freepik.com/free-photo/grilled-meat-skewers-chicken-shish-kebab-with-zucchini-tomatoes-onions_2829-10953.jpg' },
      { name: 'Jimbu Thakali', location: 'Tangal', rating: '4.8', time: 'Famous Thakali', offer: '', logo: 'https://img.freepik.com/free-photo/indian-thali-indian-food-style-waiting-be-eaten_1150-16239.jpg' },
      { name: 'Fire And Ice', location: 'Thamel', rating: '4.8', time: 'Since 1995', offer: 'Italian', logo: 'https://img.freepik.com/free-photo/freshly-baked-pizza-with-cut-slice_140725-23.jpg' },
      { name: 'Chez Caroline', location: 'Baber Mahal', rating: '4.9', time: 'French Cuisine', offer: '', logo: 'https://img.freepik.com/free-photo/gourmet-dish-with-meat-vegetables_140725-4235.jpg' },
      { name: 'Old House', location: 'Durbar Marg', rating: '4.7', time: 'Heritage', offer: '', logo: 'https://img.freepik.com/free-photo/cozy-restaurant-interior_140725-6325.jpg' },
    ]
  },
  'hot-deals': {
    title: 'Hot Deals',
    banner: 'https://img.freepik.com/free-vector/hot-deal-banner-design_1017-19597.jpg',
    restaurants: [
      { name: 'Chicken Station', location: 'Thamel', rating: '4.5', time: '15 mins', offer: 'Combo @ 999', logo: 'https://img.freepik.com/free-photo/fried-chicken-leg-with-fries_140725-5028.jpg' },
      { name: 'Pizza Hut', location: 'Durbar Marg', rating: '4.2', time: '45 mins', offer: 'Family Meal Deal', logo: 'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg' },
      { name: 'KKFC', location: 'New Road', rating: '4.1', time: '20 mins', offer: 'Bucket Saver', logo: 'https://img.freepik.com/free-photo/crispy-fried-chicken-plate-with-salad-carrot_1150-20212.jpg' },
      { name: 'Momo Magic', location: 'Basantapur', rating: '4.3', time: '25 mins', offer: 'Platter Deal', logo: 'https://img.freepik.com/free-photo/dumplings-wooden-board_140725-776.jpg' },
      { name: 'Noodle Box', location: 'Jhamsikhel', rating: '4.0', time: '30 mins', offer: 'Buy 2 Get 1', logo: 'https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg' },
      { name: 'Taco Bell', location: 'Thamel', rating: '4.4', time: '20 mins', offer: 'Taco Tuesday', logo: 'https://img.freepik.com/free-photo/mexican-tacos-with-beef-tomato-sauce-salsa_2829-14221.jpg' },
    ]
  },
  'pizza': {
    title: 'Pizza Places',
    banner: 'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg',
    restaurants: [
      { name: 'Wood Fire House', location: 'Baniyatar', rating: '4.5', time: '30 mins', offer: 'Buy 1 Get 1', logo: 'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg' },
      { name: 'Fire And Ice', location: 'Thamel', rating: '4.8', time: '45 mins', offer: 'Authentic', logo: 'https://img.freepik.com/free-photo/freshly-baked-pizza-with-cut-slice_140725-23.jpg' },
      { name: 'Roadhouse', location: 'Boudha', rating: '4.6', time: '40 mins', offer: '', logo: 'https://img.freepik.com/free-photo/delicious-italian-pizza-with-tomato-olives-pepperoni_140725-1317.jpg' },
      { name: 'Pizza World', location: 'Kalanki', rating: '4.0', time: '35 mins', offer: '20% Off', logo: 'https://img.freepik.com/free-photo/pizza-time-tasty-homemade-traditional-pizza-italian-recipe_144627-42528.jpg' },
    ]
  },
  'burger': {
    title: 'Burger Joints',
    banner: 'https://img.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg',
    restaurants: [
      { name: 'Burger House', location: 'New Baneshwor', rating: '4.8', time: '25 mins', offer: 'Free Coke', logo: 'https://img.freepik.com/free-photo/front-view-burger-stand_141793-15542.jpg' },
      { name: 'Crunchy Burger', location: 'Lazimpat', rating: '4.2', time: '30 mins', offer: '', logo: 'https://img.freepik.com/free-photo/burger-with-melted-cheese_140725-7832.jpg' },
      { name: 'Workshop Eatery', location: 'Kupondole', rating: '4.7', time: '40 mins', offer: 'Gourmet', logo: 'https://img.freepik.com/free-photo/delicious-burger-with-fresh-ingredients_23-2150857908.jpg' },
    ]
  },
  'default': {
    title: 'Restaurants',
    banner: 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg',
    restaurants: [
      { name: 'Kathmandu Kitchen', location: 'City Center', rating: '4.3', time: '35 mins', offer: 'Free Delivery', logo: 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg' }
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