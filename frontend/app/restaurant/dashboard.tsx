import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RestaurantDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Orders screen (main restaurant dashboard)
    router.replace('/restaurant/orders' as any);
  }, []);

  return null; // This component just redirects
}
