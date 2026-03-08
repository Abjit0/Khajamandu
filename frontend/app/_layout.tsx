import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          
          {/* Auth Screens */}
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="verify-signup" />
          <Stack.Screen name="otp-verification" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="profile" />
          
          {/* Customer Screens */}
          <Stack.Screen name="customer/home" />
          <Stack.Screen name="customer/baskets" />
          <Stack.Screen name="customer/inbox" />
          <Stack.Screen name="customer/more" />
          <Stack.Screen name="customer/checkout" />
          <Stack.Screen name="customer/payment-gateway" options={{ presentation: 'modal' }} />
          <Stack.Screen name="customer/order-success" />
          <Stack.Screen name="customer/order-tracking" />
          <Stack.Screen name="customer/receipt" />
          
          {/* Restaurant Screens */}
          <Stack.Screen name="restaurant/dashboard" />
          <Stack.Screen name="restaurant/orders" />
          <Stack.Screen name="restaurant/menu" />
          <Stack.Screen name="restaurant/stats" />
          <Stack.Screen name="restaurant/[id]" />
          
          {/* Rider Screens */}
          <Stack.Screen name="rider/dashboard" />
          
          {/* Admin Screens */}
          <Stack.Screen name="admin/dashboard" />
          
          {/* Category Screens */}
          <Stack.Screen name="category/[id]" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}