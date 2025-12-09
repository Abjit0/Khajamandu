import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Modal, Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import RestaurantBottomNavBar from '../../components/RestaurantBottomNavBar';
import { client, authAPI } from '../../api/client';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
  success: '#4CAF50',
  error: '#F44336'
};

export default function RestaurantMenu() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    preparationTime: '15',
    isVegetarian: false,
    spiceLevel: 'medium'
  });

  const categories = [
    { id: 'appetizer', name: 'Appetizers' },
    { id: 'main', name: 'Main Course' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'beverage', name: 'Beverages' },
    { id: 'snack', name: 'Snacks' }
  ];

  useEffect(() => {
    checkUserRole();
    fetchMenuItems();
  }, []);

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
        
        if (userData.role !== 'restaurant') {
          Alert.alert('Access Denied', 'This page is only for restaurant owners', [
            { text: 'OK', onPress: () => router.replace('/customer/home') }
          ]);
        }
      }
    } catch (error) {
      console.log('Error checking user role:', error);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await client.get('/menu/my-items');
      if (response.data.status === 'SUCCESS') {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load menu items');
    }
    setLoading(false);
  };

  const addMenuItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const itemData = {
        ...newItem,
        price: parseFloat(newItem.price),
        preparationTime: parseInt(newItem.preparationTime)
      };

      const response = await client.post('/menu/add', itemData);
      
      if (response.data.status === 'SUCCESS') {
        Alert.alert('Success', 'Menu item added successfully');
        setShowAddModal(false);
        setNewItem({
          name: '',
          description: '',
          price: '',
          category: 'main',
          preparationTime: '15',
          isVegetarian: false,
          spiceLevel: 'medium'
        });
        fetchMenuItems();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add menu item');
    }
  };

  const toggleAvailability = async (itemId: string) => {
    try {
      const response = await client.patch(`/menu/toggle/${itemId}`);
      if (response.data.status === 'SUCCESS') {
        fetchMenuItems();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update item availability');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Menu</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <ScrollView style={styles.itemsList}>
          {menuItems.map((item: any) => (
            <View key={item._id} style={styles.menuItemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemPrice}>Rs {item.price}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.statusButton, item.isAvailable ? styles.availableButton : styles.unavailableButton]}
                  onPress={() => toggleAvailability(item._id)}
                >
                  <Text style={styles.statusButtonText}>
                    {item.isAvailable ? 'Available' : 'Out of Stock'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemMeta}>
                <Text style={styles.metaText}>⏱️ {item.preparationTime} min</Text>
                {item.isVegetarian && <Text style={styles.metaText}>🥬 Vegetarian</Text>}
                {item.spiceLevel !== 'none' && <Text style={styles.metaText}>🌶️ {item.spiceLevel}</Text>}
              </View>
            </View>
          ))}
          
          {menuItems.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={60} color={COLORS.gray} />
              <Text style={styles.emptyTitle}>No menu items yet</Text>
              <Text style={styles.emptySubtitle}>Add your first menu item to get started</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Add Item Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Menu Item</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <TextInput
                style={styles.modalInput}
                placeholder="Item Name *"
                value={newItem.name}
                onChangeText={(text) => setNewItem({...newItem, name: text})}
              />
              
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Description *"
                value={newItem.description}
                onChangeText={(text) => setNewItem({...newItem, description: text})}
                multiline
                numberOfLines={3}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Price (Rs) *"
                value={newItem.price}
                onChangeText={(text) => setNewItem({...newItem, price: text})}
                keyboardType="numeric"
              />
              
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Category:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryChip, newItem.category === cat.id && styles.selectedChip]}
                      onPress={() => setNewItem({...newItem, category: cat.id})}
                    >
                      <Text style={[styles.chipText, newItem.category === cat.id && styles.selectedChipText]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Preparation Time (minutes)"
                value={newItem.preparationTime}
                onChangeText={(text) => setNewItem({...newItem, preparationTime: text})}
                keyboardType="numeric"
              />
              
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setNewItem({...newItem, isVegetarian: !newItem.isVegetarian})}
              >
                <View style={[styles.checkbox, newItem.isVegetarian && styles.checkedBox]}>
                  {newItem.isVegetarian && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
                </View>
                <Text style={styles.checkboxLabel}>Vegetarian</Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addMenuItem}
              >
                <Text style={styles.saveButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <RestaurantBottomNavBar />
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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: { marginTop: 50 },
  itemsList: { flex: 1, padding: 15 },
  menuItemCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  itemCategory: { fontSize: 12, color: COLORS.gray, textTransform: 'capitalize' },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginTop: 4 },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 80
  },
  availableButton: { backgroundColor: COLORS.success },
  unavailableButton: { backgroundColor: COLORS.error },
  statusButtonText: { color: COLORS.white, fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
  itemDescription: { fontSize: 14, color: COLORS.gray, marginBottom: 8 },
  itemMeta: { flexDirection: 'row', flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: COLORS.gray, marginRight: 15 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark, marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginTop: 5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark },
  modalForm: { maxHeight: 400 },
  modalInput: {
    backgroundColor: COLORS.bg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  pickerSection: { marginBottom: 15 },
  pickerLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: COLORS.dark },
  categoryChip: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray
  },
  selectedChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.dark },
  selectedChipText: { color: COLORS.white },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkedBox: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxLabel: { fontSize: 14, color: COLORS.dark },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  cancelButton: { backgroundColor: COLORS.gray },
  saveButton: { backgroundColor: COLORS.primary },
  cancelButtonText: { color: COLORS.white, fontWeight: 'bold' },
  saveButtonText: { color: COLORS.white, fontWeight: 'bold' },
});
