import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

export default function BasketsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY BASKETS</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="cart-outline" size={80} color="#CCC" style={{ marginBottom: 20 }} />
        <Text style={styles.text}>Sorry! You don't have any Cart</Text>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#E6753A', padding: 15, paddingTop: 40, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
  text: { fontSize: 16, color: '#888' },
});