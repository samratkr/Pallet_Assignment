import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../navigator/AppNavigation';
import { addToCart, removeFromCart } from '../store/reducers/cartReducer';
import { AppDispatch, RootState } from '../store/store';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const product = useSelector(
    (state: RootState) => state?.product?.singleProduct,
  );
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const cartProducts = useSelector((state: RootState) => state?.cart?.items);
  console.error(cartProducts, 'cardDetakiksls');
  const imageUrl =
    product?.image ||
    product?.variants?.[0]?.images?.[0]?.url ||
    'https://via.placeholder.com/300';
  const description = product.description || 'No description available';

  const productImage =
    product?.image || product?.variants?.[0]?.images?.[0]?.url || null;
  const productName = product?.name || product?.title || 'No Name';
  const foodType = product?.attributes?.foodType;
  const productPrice =
    product?.variants[0]?.inventorySync?.sellingPrice || 'N/A';
  const mrpPrice =
    product?.variants[0]?.inventorySync?.mrp ?? productPrice ?? 'N/A';

  return (
    <SafeAreaView style={{}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Text style={styles.iconButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pallet Shop</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={
            productImage
              ? {
                  uri: productImage,
                }
              : product?.variants?.[0]?.images?.[0]?.url
              ? product?.variants?.[0]?.images?.[0]?.url
              : foodType === 'NON_VEG'
              ? require('../../assets/images/Chicken-Tikka-Masala.webp')
              : require('../../assets/images/Green-Capsicum.webp')
          }
          style={styles.image}
        />

        <Text style={styles.name}>{productName}</Text>
        <Text style={styles.price}>₹{productPrice}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => dispatch(addToCart(product))}
          >
            <Text style={styles.addbuttonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => dispatch(removeFromCart(product.id))}
          >
            <Text style={styles.buttonText}>Remove from Cart</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewCart}>
          <TouchableOpacity
            style={[styles.button, styles.viewButton]}
            onPress={() => dispatch(removeFromCart(product.id))}
          >
            <Text style={styles.viewCartText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: height * 0.92,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  iconButton: {
    padding: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e3e3e3ff',
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  image: {
    marginTop: 30,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 16,
    marginBottom: 20,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2ecc71',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addbuttonText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  viewCart: {
    position: 'absolute',
    bottom: 30,
    width: width * 0.95,
    alignSelf: 'center',
  },
  viewButton: {
    backgroundColor: '#000',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },
});

export default ProductDetailsScreen;
