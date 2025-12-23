import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons'; 

const COLORS = {
  white: '#FFFFFF',
  grayText: '#8A8A8A',
  accentOrange: '#E6753A',
  redError: '#FF4444', // New Error Color
};

interface CustomInputProps {
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string; // <--- New Optional Error Prop
}

const CustomInput = ({ 
  placeholder, 
  value, 
  setValue, 
  isPassword = false, 
  keyboardType = 'default',
  error
}: CustomInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer, 
        error ? { borderColor: COLORS.redError, borderWidth: 1 } : null // Red border if error
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.grayText}
          value={value}
          onChangeText={setValue}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.iconContainer}>
            <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color={COLORS.grayText} />
          </TouchableOpacity>
        )}
      </View>
      {/* Show Error Message if it exists */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10, // Space between inputs
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  input: { flex: 1, height: '100%', fontSize: 16, color: '#333' },
  iconContainer: { padding: 10 },
  errorText: {
    color: COLORS.redError,
    fontSize: 12,
    marginLeft: 20,
    marginTop: 5,
  }
});

export default CustomInput;