import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  white: '#FFFFFF',
  textDark: '#2D2D2D',
  accentOrange: '#E6753A',
  textGray: '#8A8A8A',
  red: '#FF0000',
  borderColor: '#E8E8E8',
};

interface CustomInputProps {
  value: string;
  setValue: (text: string) => void;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  editable?: boolean;
  maxLength?: number;
}

const CustomInput = ({ 
  value, 
  setValue, 
  placeholder, 
  isPassword, 
  keyboardType = 'default',
  error,
  editable = true,
  maxLength,
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer, 
        error ? styles.inputError : null,
        !editable ? styles.inputDisabled : null,
      ]}>
        <TextInput 
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          style={[styles.input, !editable && { color: COLORS.textGray }]}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          maxLength={maxLength}
          placeholderTextColor={COLORS.textGray}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={COLORS.textGray}
            />
          </TouchableOpacity>
        )}
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
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 0,
    height: 55,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
    height: '100%',
    textAlignVertical: 'center',
    paddingVertical: 0,
    includeFontPadding: false,
  },
  eyeButton: {
    paddingLeft: 8,
  },
  inputError: {
    borderColor: COLORS.red,
    borderWidth: 1,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
});

export default CustomInput;