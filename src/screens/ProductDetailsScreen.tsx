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
import SimpleDropDown from '../customComponents/SimpleDropDown';
import SaleDropDown from '../customComponents/SaleDropDown';
import QuantitySelector from '../customComponents/QuantitySelector';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const { width } = Dimensions.get('window');

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
    setQuantity(newQuantity);
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
    setQuantity(newQuantity);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Text style={styles.iconButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pallet Shop</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={
            productImage
              ? { uri: productImage }
              : foodType === 'NON_VEG'
              ? require('../../assets/images/Chicken-Tikka-Masala.webp')
              : require('../../assets/images/Green-Capsicum.webp')
          }
          style={styles.image}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }} />
          <Image
            source={require('../../assets/images/barcode.png')}
            style={styles.barcodeImage}
          />
          <View style={styles.deliveryTime}>
            <Image
              source={require('../../assets/images/delivery.png')}
              style={styles.deliveryImage}
            />
            <Text style={styles.deliveryText}>2 hrs</Text>
          </View>
        </View>
        <Text style={[styles.name, styles.mb15]}>{productName}</Text>
        <Text style={[styles.price, styles.mb15]}>₹{productPrice}</Text>
        <Text style={[styles.description, styles.mb15]}>{description}</Text>
        <View style={styles.mb15}>
          <QuantitySelector item={product} />
        </View>
        <View style={styles.mb15}>
          <SaleDropDown />
        </View>
        {quantity === 0 ? (
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              styles.mb15,
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
          <View style={[styles.counterContainer, styles.mb15]}>
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
        <View style={{ height: 100 }} /> {/* Spacer for bottom button */}
      </ScrollView>

      <View style={styles.viewCart}>
        <TouchableOpacity
          style={[styles.button, styles.viewButton]}
          onPress={() => dispatch(removeFromCart(product.productId))}
        >
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.05,
    paddingVertical: 16,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  mb15: {
    marginBottom: 15,
  },
  iconButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  deliveryTime: {
    flexDirection: 'row',
    backgroundColor: 'rgba(153, 151, 151, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'flex-end',
    right: 10,
  },
  deliveryText: {
    color: '#000',
    fontSize: 12,
  },
  deliveryImage: {
    width: width * 0.06,
    height: width * 0.03,
    resizeMode: 'contain',
  },
  barcodeImage: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
    alignSelf: 'center',
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
    marginTop: 20,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 16,
    marginBottom: 5,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2ecc71',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
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
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cartText: {
    color: '#d63333ff',
    fontWeight: '900',
    fontSize: 20,
  },
});

export default ProductDetailsScreen;
