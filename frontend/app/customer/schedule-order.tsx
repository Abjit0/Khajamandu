import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#E6753A',
  bg: '#F8F4E9',
  white: '#FFFFFF',
  dark: '#2D2D2D',
  gray: '#8A8A8A',
};

export default function ScheduleOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  const today = new Date();

  const handleConfirm = () => {
    const h = parseInt(hour);
    const m = parseInt(minute);

    if (!hour || isNaN(h) || h < 1 || h > 12) {
      Alert.alert('Invalid hour', 'Please enter hour between 1 and 12');
      return;
    }
    if (minute === '' || isNaN(m) || m < 0 || m > 59) {
      Alert.alert('Invalid minute', 'Please enter minutes between 00 and 59');
      return;
    }

    // Convert to 24-hour
    let hour24 = h;
    if (ampm === 'AM' && h === 12) hour24 = 0;
    if (ampm === 'PM' && h !== 12) hour24 = h + 12;

    const scheduledDate = new Date(today);
    scheduledDate.setHours(hour24, m, 0, 0);

    const now = new Date();
    const diff = scheduledDate.getTime() - now.getTime();
    if (diff < 30 * 60 * 1000) {
      Alert.alert('Too soon', 'Please schedule at least 30 minutes from now.');
      return;
    }

    router.push({
      pathname: '/customer/checkout',
      params: {
        data: params.data,
        scheduledTime: scheduledDate.toISOString(),
        isPreOrder: 'true',
      }
    } as any);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="time-outline" size={22} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Pre-order your food so it's freshly prepared and ready when you arrive.
          </Text>
        </View>

        {/* Time Input */}
        <Text style={styles.label}>Select Time</Text>
        <View style={styles.timeRow}>

          {/* Hour */}
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxLabel}>Hour</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="1"
              value={hour}
              onChangeText={setHour}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <Text style={styles.colon}>:</Text>

          {/* Minute */}
          <View style={styles.timeBox}>
            <Text style={styles.timeBoxLabel}>Minute</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="00"
              value={minute}
              onChangeText={setMinute}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          {/* AM / PM toggle pill */}
          <View style={styles.ampmBox}>
            <Text style={styles.timeBoxLabel}>  </Text>
            <View style={styles.ampmPill}>
              <TouchableOpacity
                style={[styles.ampmBtn, ampm === 'AM' && styles.ampmActive]}
                onPress={() => setAmpm('AM')}
              >
                <Text style={[styles.ampmText, ampm === 'AM' && styles.ampmTextActive]}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ampmBtn, ampm === 'PM' && styles.ampmActive]}
                onPress={() => setAmpm('PM')}
              >
                <Text style={[styles.ampmText, ampm === 'PM' && styles.ampmTextActive]}>PM</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Preview */}
        {hour !== '' && minute !== '' && (
          <View style={styles.previewBox}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.previewText}>
              Today at {hour}:{minute.padStart(2, '0')} {ampm}
            </Text>
          </View>
        )}

        {/* Hint */}
        <Text style={styles.hint}>Must be at least 30 minutes from now</Text>

        {/* Confirm */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.confirmText}>Confirm Schedule</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20,
    backgroundColor: COLORS.white, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },
  content: { padding: 20 },

  infoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF0E6', padding: 14, borderRadius: 12,
    marginBottom: 24, borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  infoText: { flex: 1, fontSize: 13, color: COLORS.dark, lineHeight: 18 },

  label: { fontSize: 15, fontWeight: 'bold', color: COLORS.dark, marginBottom: 10 },

  dayRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  dayBtn: { flex: 1 },
  dayBtnActive: {},
  dayBtnText: {},
  dayBtnDate: {},
  dayBtnTextActive: {},

  timeRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    gap: 10, marginBottom: 16,
  },
  timeBox: { alignItems: 'center' },
  timeBoxLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 6 },
  timeInput: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E0E0E0',
    width: 70, height: 56, textAlign: 'center',
    fontSize: 22, fontWeight: 'bold', color: COLORS.dark,
  },
  colon: { fontSize: 28, fontWeight: 'bold', color: COLORS.dark, marginBottom: 10 },

  ampmBox: { alignItems: 'center' },
  ampmPill: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    height: 56,
    alignItems: 'center',
  },
  ampmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ampmActive: { backgroundColor: COLORS.primary },
  ampmText: { fontSize: 14, fontWeight: 'bold', color: COLORS.gray },
  ampmTextActive: { color: COLORS.white },

  previewBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF0E6', padding: 12, borderRadius: 10, marginBottom: 8,
  },
  previewText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },

  hint: { fontSize: 12, color: COLORS.gray, marginBottom: 28 },

  confirmBtn: {
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  confirmText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});

// updated: 2026-04-27T14:00:00
