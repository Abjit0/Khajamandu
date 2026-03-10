import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../../components/BottomNavBar';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

const CART_STORAGE_KEY = '@basket_cart_items';

export default function BasketsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Load cart data from storage or params
  const loadCart = async () => {
    try {
      // First, check if there's stored cart data
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      
      if (storedCart) {
        // Use stored cart data
        setCartItems(JSON.parse(storedCart));
      } else if (params.data) {
        // If no stored data, check params (new items from restaurant)
        const restaurantItems = JSON.parse(params.data as string);
        const restaurantName = params.restaurant as string || 'Restaurant';
        
        // Convert restaurant menu items to cart format
        const formattedItems = restaurantItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          restaurant: restaurantName,
          price: item.price,
          qty: item.qty,
          image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
        }));
        
        setCartItems(formattedItems);
        // Save to storage
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(formattedItems));
      } else {
        // No data at all - empty cart
        setCartItems([]);
      }
    } catch (error) {
      console.log('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCart();
    }
  }, [cartItems]);

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.log('Error saving cart:', error);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, qty: Math.max(0, item.qty + change) }
          : item
      ).filter(item => item.qty > 0)
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    router.push({
      pathname: '/customer/checkout',
      params: { data: JSON.stringify(cartItems) }
    } as any);
  };

  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Basket</Text>
        <View style={styles.headerRow}>
          <Text style={styles.subtitle}>{cartItems.length} items</Text>
          {cartItems.length > 0 && (
            <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Your basket is empty</Text>
            <Text style={styles.emptySubtitle}>Add some delicious food to get started</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.replace('/customer/home')}
            >
              <Text style={styles.browseButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cartItems.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
                  <Text style={styles.itemPrice}>Rs {item.price}</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Ionicons name="remove" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.qty}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Ionicons name="add" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>Rs {subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>Rs {deliveryFee}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rs {total}</Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 20, alignItems: 'center' },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 4,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark },
  subtitle: { fontSize: 14, color: COLORS.gray },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  clearButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: { flex: 1, paddingHorizontal: 20 },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark, marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: COLORS.gray, marginTop: 8, textAlign: 'center' },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  browseButtonText: { color: COLORS.white, fontWeight: 'bold' },
  
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  itemRestaurant: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginTop: 4 },
  
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginHorizontal: 12,
  },
  
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark, marginBottom: 16 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: COLORS.gray },
  summaryValue: { fontSize: 14, color: COLORS.dark },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.bg,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});