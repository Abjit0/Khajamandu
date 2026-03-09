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
  { id: '1', name: 'Steam Chicken Momo', price: 250, desc: 'Juicy chicken mince with spices', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop' },
  { id: '2', name: 'Fried Chicken Momo', price: 280, desc: 'Crispy fried momo with spicy chutney', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
  { id: '3', name: 'Jhol Momo', price: 300, desc: 'Served in sesame and peanut soup', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop' },
  { id: '4', name: 'Coca Cola', price: 100, desc: 'Chilled 500ml', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop' },
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