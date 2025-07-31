import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
// import BarcodeScannerScreen from '../screens/CodeScannerScreen';

export type RootStackParamList = {
  Login: undefined;
  ProductList: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  // Scanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        {/* <Stack.Screen name="Scanner" component={BarcodeScannerScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
