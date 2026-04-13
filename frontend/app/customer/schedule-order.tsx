import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
  light: '#F0F0F0',
};

// Generate time slots from now + 1 hour up to 8 hours ahead, in 30-min intervals
function generateTimeSlots() {
  const slots = [];
  const now = new Date();
  // Start from next 30-min boundary + 1 hour minimum
  const start = new Date(now);
  start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30 + 60, 0, 0);

  for (let i = 0; i < 16; i++) {
    const slot = new Date(start.getTime() + i * 30 * 60 * 1000);
    // Only show slots within today and tomorrow
    const dayDiff = Math.floor((slot.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff > 1) break;
    slots.push(slot);
  }
  return slots;
}

function formatSlot(date: Date) {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const label = isToday ? 'Today' : 'Tomorrow';
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { label, time, full: `${label}, ${time}` };
}

export default function ScheduleOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const timeSlots = generateTimeSlots();
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const handleConfirm = () => {
    if (!selectedSlot) {
      Alert.alert('Select a time', 'Please choose a pickup/delivery time.');
      return;
    }
    // Pass scheduled time back to checkout
    router.push({
      pathname: '/customer/checkout',
      params: {
        data: params.data,
        scheduledTime: selectedSlot.toISOString(),
        isPreOrder: 'true',
      }
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="time-outline" size={28} color={COLORS.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.infoTitle}>Pre-Order Your Food</Text>
            <Text style={styles.infoText}>
              Choose a time and your food will be freshly prepared and ready exactly when you arrive.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Pickup / Delivery Time</Text>

        {timeSlots.map((slot, index) => {
          const { label, time, full } = formatSlot(slot);
          const isSelected = selectedSlot?.toISOString() === slot.toISOString();
          return (
            <TouchableOpacity
              key={index}
              style={[styles.slotCard, isSelected && styles.slotSelected]}
              onPress={() => setSelectedSlot(slot)}
            >
              <View style={styles.slotLeft}>
                <Text style={[styles.slotDay, isSelected && styles.slotTextSelected]}>{label}</Text>
                <Text style={[styles.slotTime, isSelected && styles.slotTextSelected]}>{time}</Text>
              </View>
              <View style={[styles.slotRadio, isSelected && styles.slotRadioSelected]}>
                {isSelected && <View style={styles.slotRadioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.gray} />
          <Text style={styles.noteText}>
            You'll receive a notification 30 minutes before your scheduled time confirming your food is being prepared.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {selectedSlot && (
          <Text style={styles.selectedLabel}>
            Scheduled: {formatSlot(selectedSlot).full}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.confirmBtn, !selectedSlot && styles.disabledBtn]}
          onPress={handleConfirm}
          disabled={!selectedSlot}
        >
          <Ionicons name="calendar-outline" size={20} color={COLORS.white} />
          <Text style={styles.confirmText}>Confirm Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 20, alignItems: 'center',
    backgroundColor: COLORS.white, elevation: 2
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  content: { padding: 20, paddingBottom: 40 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FFF0E6', padding: 16, borderRadius: 12,
    marginBottom: 24, borderLeftWidth: 4, borderLeftColor: COLORS.primary
  },
  infoTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.dark, marginBottom: 4 },
  infoText: { fontSize: 13, color: COLORS.gray, lineHeight: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark, marginBottom: 12 },
  slotCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, padding: 16, borderRadius: 12,
    marginBottom: 10, borderWidth: 1.5, borderColor: 'transparent', elevation: 1
  },
  slotSelected: { borderColor: COLORS.primary, backgroundColor: '#FFF8F4' },
  slotLeft: {},
  slotDay: { fontSize: 12, color: COLORS.gray, marginBottom: 2 },
  slotTime: { fontSize: 16, fontWeight: 'bold', color: COLORS.dark },
  slotTextSelected: { color: COLORS.primary },
  slotRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.gray,
    justifyContent: 'center', alignItems: 'center'
  },
  slotRadioSelected: { borderColor: COLORS.primary },
  slotRadioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.primary },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.light, padding: 14, borderRadius: 10, marginTop: 16
  },
  noteText: { fontSize: 12, color: COLORS.gray, marginLeft: 8, flex: 1, lineHeight: 18 },
  footer: { padding: 20, backgroundColor: COLORS.white, elevation: 5 },
  selectedLabel: {
    fontSize: 13, color: COLORS.primary, fontWeight: '600',
    textAlign: 'center', marginBottom: 10
  },
  confirmBtn: {
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8
  },
  disabledBtn: { backgroundColor: COLORS.gray, opacity: 0.5 },
  confirmText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});
