import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A'
};

// Mock Menu Items
const MENU_ITEMS = [
  // APPETIZERS & STARTERS
  { id: '1', name: 'Steam Chicken Momo', price: 250, desc: 'Juicy chicken mince with spices', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop' },
  { id: '2', name: 'Fried Chicken Momo', price: 280, desc: 'Crispy fried momo with spicy chutney', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
  { id: '3', name: 'Jhol Momo', price: 300, desc: 'Served in sesame and peanut soup', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop' },
  { id: '4', name: 'Veg Steam Momo', price: 200, desc: 'Fresh vegetables wrapped in thin dough', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop' },
  { id: '5', name: 'Chicken Chili', price: 450, desc: 'Spicy chicken with bell peppers and onions', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop' },
  { id: '6', name: 'Chicken Wings', price: 380, desc: 'Crispy wings with buffalo sauce', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop' },
  
  // MAIN COURSES
  { id: '7', name: 'Chicken Biryani', price: 650, desc: 'Aromatic basmati rice with tender chicken', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
  { id: '8', name: 'Mutton Biryani', price: 750, desc: 'Premium mutton with fragrant spices', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
  { id: '9', name: 'Dal Bhat Set', price: 350, desc: 'Traditional Nepali meal with rice, lentils & curry', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
  { id: '10', name: 'Chicken Curry', price: 480, desc: 'Tender chicken in rich tomato gravy', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
  { id: '11', name: 'Mutton Curry', price: 580, desc: 'Slow-cooked mutton in traditional spices', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
  { id: '12', name: 'Fish Curry', price: 520, desc: 'Fresh fish in coconut curry sauce', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop' },
  
  // PIZZA & ITALIAN
  { id: '13', name: 'Margherita Pizza', price: 650, desc: 'Classic tomato, mozzarella and basil', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
  { id: '14', name: 'Pepperoni Pizza', price: 750, desc: 'Spicy pepperoni with cheese', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' },
  { id: '15', name: 'Chicken BBQ Pizza', price: 850, desc: 'BBQ chicken with onions and peppers', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop' },
  { id: '16', name: 'Chicken Alfredo Pasta', price: 580, desc: 'Creamy alfredo sauce with grilled chicken', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
  { id: '17', name: 'Spaghetti Bolognese', price: 520, desc: 'Classic meat sauce with parmesan', image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=300&fit=crop' },
  
  // BURGERS & SANDWICHES
  { id: '18', name: 'Classic Beef Burger', price: 450, desc: 'Juicy beef patty with lettuce and tomato', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { id: '19', name: 'Chicken Burger', price: 420, desc: 'Grilled chicken breast with mayo', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop' },
  { id: '20', name: 'Cheese Burger', price: 480, desc: 'Double cheese with beef patty', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop' },
  { id: '21', name: 'Club Sandwich', price: 380, desc: 'Triple layer with chicken, bacon and veggies', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
  
  // NOODLES & ASIAN
  { id: '22', name: 'Chicken Chow Mein', price: 350, desc: 'Stir-fried noodles with chicken and vegetables', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop' },
  { id: '23', name: 'Veg Chow Mein', price: 300, desc: 'Mixed vegetables with soft noodles', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
  { id: '24', name: 'Chicken Fried Rice', price: 320, desc: 'Wok-fried rice with chicken and egg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
  { id: '25', name: 'Thukpa', price: 280, desc: 'Tibetan noodle soup with vegetables', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
  
  // DESSERTS
  { id: '26', name: 'Chocolate Cake', price: 250, desc: 'Rich chocolate cake with cream frosting', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
  { id: '27', name: 'Cheesecake', price: 280, desc: 'Creamy New York style cheesecake', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop' },
  { id: '28', name: 'Ice Cream Sundae', price: 180, desc: 'Vanilla ice cream with chocolate sauce', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop' },
  
  // BEVERAGES
  { id: '29', name: 'Coca Cola', price: 100, desc: 'Chilled 500ml', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop' },
  { id: '30', name: 'Fresh Lime Soda', price: 120, desc: 'Refreshing lime with soda water', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop' },
  { id: '31', name: 'Mango Lassi', price: 150, desc: 'Creamy yogurt drink with mango', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop' },
  { id: '32', name: 'Black Coffee', price: 80, desc: 'Freshly brewed black coffee', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop' },
  { id: '33', name: 'Cappuccino', price: 180, desc: 'Espresso with steamed milk foam', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
  { id: '34', name: 'Green Tea', price: 60, desc: 'Organic green tea leaves', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
];

export default function RestaurantMenuScreen() {
  const router = useRouter();
  
  // 1. Receive Restaurant Data
  const params = useLocalSearchParams();
  const { id, image, location, rating } = params; 

  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newQty = (prev[itemId] || 0) - 1;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  // ✅ NEW FUNCTION: Pack the food and go to Basket
  const handleViewBasket = () => {
    // 1. Filter only items that have quantity > 0
    const selectedItems = MENU_ITEMS
      .filter((item) => cart[item.id] > 0) 
      .map((item) => ({
        ...item,
        qty: cart[item.id], // Add quantity to the item data
      }));

    // 2. Send data to the Basket Page
    router.push({
      pathname: '/customer/baskets',
      params: { 
        data: JSON.stringify(selectedItems), // Convert array to string
        restaurant: id // Pass restaurant name too
      }
    } as any);
  };

  // Calculate Totals
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = MENU_ITEMS.reduce((sum, item) => sum + (item.price * (cart[item.id] || 0)), 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image 
          source={{ uri: (image as string) || 'https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg' }} 
          style={styles.headerImage} 
        />
        <View style={styles.headerOverlay} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.resTitle}>{id}</Text> 
        <Text style={styles.resMeta}>{location} • ⭐ {rating}</Text>
        <View style={styles.divider} />
        <Text style={styles.menuTitle}>Menu</Text>
      </View>

      {/* Menu List */}
      <ScrollView contentContainerStyle={styles.menuList}>
        {MENU_ITEMS.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <View key={item.id} style={styles.menuItem}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>Rs. {item.price}</Text>
                <Text style={styles.foodDesc}>{item.desc}</Text>
              </View>

              <View style={styles.foodImageContainer}>
                <Image source={{ uri: item.image }} style={styles.foodImage} />
                {qty === 0 ? (
                  <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item.id)}>
                    <Text style={styles.addButtonText}>ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}><Text style={styles.qtyText}>-</Text></TouchableOpacity>
                    <Text style={styles.qtyValue}>{qty}</Text>
                    <TouchableOpacity onPress={() => addToCart(item.id)}><Text style={styles.qtyText}>+</Text></TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* View Basket Button */}
      {totalItems > 0 && (
        <View style={styles.floatingContainer}>
          {/* ✅ UPDATED: Call handleViewBasket instead of just router.push */}
          <TouchableOpacity style={styles.viewBasketBtn} onPress={handleViewBasket}>
            <View style={styles.basketBadge}><Text style={styles.basketCount}>{totalItems}</Text></View>
            <Text style={styles.viewBasketText}>View Basket</Text>
            <Text style={styles.basketTotal}>Rs. {totalPrice}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  headerImageContainer: { height: 200, width: '100%' },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  infoContainer: { padding: 20, backgroundColor: COLORS.bg, borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -25 },
  resTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark },
  resMeta: { color: COLORS.gray, marginTop: 5 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 15 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark, marginBottom: 10 },
  menuList: { paddingBottom: 100, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 20 },
  foodName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  foodPrice: { fontSize: 14, color: COLORS.dark, marginVertical: 4 },
  foodDesc: { fontSize: 12, color: COLORS.gray },
  foodImageContainer: { alignItems: 'center', width: 100 },
  foodImage: { width: 100, height: 90, borderRadius: 12, backgroundColor: '#eee' },
  addButton: { position: 'absolute', bottom: -10, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 6, borderRadius: 6, elevation: 2 },
  addButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
  qtyContainer: { position: 'absolute', bottom: -10, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, elevation: 3 },
  qtyText: { color: 'white', fontWeight: 'bold', fontSize: 18, paddingHorizontal: 5 },
  qtyValue: { color: 'white', fontWeight: 'bold', marginHorizontal: 8 },
  floatingContainer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  viewBasketBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, elevation: 5 },
  basketBadge: { backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  basketCount: { color: COLORS.primary, fontWeight: 'bold' },
  viewBasketText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  basketTotal: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});