import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from '../store/reducers/cartReducer';
import { AppDispatch, RootState } from '../store/store';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const product = useSelector(
    (state: RootState) => state?.product?.singleProduct,
  );

  const quantityNum = useSelector((state: any) => {
    return (
      state.cart.items.find(
        (cartItem: any) => cartItem.productId === product.productId,
      )?.quantity || 0
    );
  });

  const [quantity, setQuantity] = useState(quantityNum || 0);

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

  const handleIncrement = (product: any) => {
    const newQuantity = quantity + 1;
    setQuantity(quantity + 1);
    if (quantity === 0) {
      dispatch(addToCart(product));
    } else {
      dispatch(
        updateQuantity({ productId: product.productId, quantity: newQuantity }),
      );
    }
  };

  const handleDecrement = (product: any) => {
    const newQuantity = quantity - 1;
    setQuantity(quantity - 1);
    if (newQuantity === 0) {
      dispatch(removeFromCart(product.productId));
    } else {
      dispatch(
        updateQuantity({
          productId: product.productId,
          quantity: newQuantity,
        }),
      );
    }
  };
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
        {quantity === 0 ? (
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !product?.inStock && { borderColor: '#eee' },
            ]}
            disabled={!mrpPrice && !productPrice}
            onPress={() => {
              handleIncrement(product);
            }}
          >
            <Text
              style={[styles.cartText, !product?.inStock && { color: '#eee' }]}
            >
              Add
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                if (quantity === 1) {
                  setQuantity(0);
                  dispatch(removeFromCart(product?.productId));
                } else {
                  handleDecrement(product);
                }
              }}
            >
              <Text style={styles.counterText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.counterValue}>{quantity}</Text>

            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                handleIncrement(product);
              }}
            >
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.viewCart}>
          <TouchableOpacity
            style={[styles.button, styles.viewButton]}
            onPress={() => dispatch(removeFromCart(product.productId))}
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
  iconButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    bottom: 0,
    width: width,
    alignSelf: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  viewButton: {
    backgroundColor: '#000',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#d63333ff',
    borderRadius: 4,
  },
  counterButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
    borderColor: '#d63333ff',
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d63333ff',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#d63333ff',
    alignItems: 'center',
    width: width * 0.9,
    justifyContent: 'center',
  },
  cartText: {
    color: '#d63333ff',
    fontWeight: '900',
    fontSize: 20,
  },
});

export default ProductDetailsScreen;
