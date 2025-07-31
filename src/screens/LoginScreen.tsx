import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../customComponents/Loader';
import { GetProductApiHelper } from '../store/helpers/productApis';
import { setUser } from '../store/reducers/authReducer';
import { AppDispatch, RootState } from '../store/store';

type RootStackParamList = {
  Login: undefined;
  ProductList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state?.auth?.user);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '54711070893-b486b5cuq96jk35r96g6t2j6ualesh4i.apps.googleusercontent.com',
    });
  }, []);

  const loading = useSelector((state: any) => state.product.loading);

  const signInWithGoogle = async () => {
    try {
      // await GoogleSignin.hasPlayServices();
      // const userInfo = await GoogleSignin.signIn();
      // dispatch(setUser(userInfo?.user));
      const getProducts = await dispatch(
        GetProductApiHelper({
          page: '1',
          pageSize: '5',
          storeLocationId: 'RLC_83',
        }),
      );
      if (getProducts?.meta?.requestStatus === 'fulfilled') {
        navigation.navigate('ProductList');
      } else {
        console.error('API failed');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google Sign-In was cancelled.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-In is in progress...');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services not available or outdated.');
      } else {
        Alert.alert('Error', 'Something went wrong during sign-in.');
        console.error('Google Sign-In Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
      {user?.name && <Text style={styles.title}>{user?.name}</Text>}
      <Text style={styles.title}>Welcome to Pallet Shop</Text>
      <Text style={styles.subtitle}>Sign in with Google to get started</Text>
      <Pressable style={styles.googleButton} onPress={signInWithGoogle}>
        <Image
          source={require('../../assets/images/google-Icon.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  googleIcon: {
    marginRight: 12,
    height: 16,
    width: 16,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
