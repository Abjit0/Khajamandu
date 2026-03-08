import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const COLORS = {
  white: '#FFFFFF',
  textDark: '#2D2D2D',
  accentOrange: '#E6753A',
  textGray: '#8A8A8A',
  red: '#FF0000',
  borderColor: '#E8E8E8',
};

// If using TypeScript, define the interface. If JS, this is ignored.
interface CustomInputProps {
  value: string;
  setValue: (text: string) => void;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  editable?: boolean; // We added this
  maxLength?: number; // We added this
}

const CustomInput = ({ 
  value, 
  setValue, 
  placeholder, 
  isPassword, 
  keyboardType = 'default',
  error,
  editable = true, // Default to true (unlocked)
  maxLength,
}: CustomInputProps) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer, 
        error ? styles.inputError : null,
        !editable ? styles.inputDisabled : null // Add grey style if locked
      ]}>
        <TextInput 
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          style={[styles.input, !editable && { color: COLORS.textGray }]} // Grey text if locked
          secureTextEntry={isPassword}
          keyboardType={keyboardType}
          editable={editable} // Pass this down
          maxLength={maxLength} // Pass this down
          placeholderTextColor={COLORS.textGray}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: 30, // Matching your rounded design
    paddingHorizontal: 20,
    paddingVertical: 0, // Remove vertical padding to let TextInput handle it
    height: 55, // Fixed height for consistency
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: COLORS.textDark,
    height: '100%', // Take full height
    textAlignVertical: 'center', // Center text vertically
    paddingVertical: 0, // Remove default padding
    includeFontPadding: false, // Remove extra font padding on Android
  },
  inputError: {
    borderColor: COLORS.red,
    borderWidth: 1,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0', // Light grey background when locked
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
});

export default CustomInput;