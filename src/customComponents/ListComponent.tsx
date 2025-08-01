import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from '../store/reducers/cartReducer';
import { singleProduct } from '../store/reducers/productReducer';
import { AppDispatch } from '../store/store';
import SimpleDropDown from './SimpleDropDown';
import SaleDropDown from './SaleDropDown';
import QuantitySelector from './QuantitySelector';

const { width, height } = Dimensions.get('window');

const ListComponent = ({ item, quantityMap }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const quantity = quantityMap[item?.productId] || 0;

  const productImage =
    item.image || item?.variants?.[0]?.images?.[0]?.url || null;
  const productName = item.name || item.title || 'No Name';
  const foodType = item?.attributes?.foodType;
  const productPrice = item?.variants[0]?.inventorySync?.sellingPrice || 'N/A';
  const mrpPrice =
    item?.variants[0]?.inventorySync?.mrp ?? productPrice ?? 'N/A';

  const handleIncrement = (product: any) => {
    const newQuantity = quantity + 1;
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
    if (newQuantity === 0) {
      dispatch(removeFromCart(product.productId));
    } else {
      dispatch(
        updateQuantity({ productId: product.productId, quantity: newQuantity }),
      );
    }
  };

  const handleSingleProduct = async (item: any) => {
    const result = await dispatch(singleProduct(item));
    if (result) {
      navigation.navigate('ProductDetails');
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleSingleProduct(item)}
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
            resizeMode="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>10% OFF</Text>
          </View>
          <Image
            source={
              foodType === 'NON_VEG'
                ? require('../../assets/images/non-veg-foodtype.webp')
                : require('../../assets/images/vegan.webp')
            }
            style={styles.itemSymbol}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.deliveryTime}>
          <Image
            source={require('../../assets/images/delivery.png')}
            style={styles.deliveryImage}
          />
          <Text style={styles.deliveryText}>2 hrs</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.brand}>Fresho</Text>
          <Text style={styles.productName}>
            {productName.length > 40
              ? productName.substring(0, 40) + '...'
              : productName}
          </Text>

          {/* <SimpleDropDown /> */}
          <QuantitySelector item={item} />

          <View style={styles.priceRow}>
            <Text style={styles.sellingPrice}>₹{productPrice}</Text>
            <Text style={styles.mrp}>{mrpPrice}</Text>
          </View>

          <SaleDropDown />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={styles.saveIconContainer}>
              <Image
                source={require('../../assets/images/save_icon.png')}
                style={styles.saveIconImage}
              />
            </View>

            {quantity === 0 ? (
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  !item?.inStock && { borderColor: '#eee' },
                ]}
                disabled={!mrpPrice && !productPrice}
                onPress={() => {
                  handleIncrement(item);
                }}
              >
                <Text
                  style={[styles.cartText, !item?.inStock && { color: '#eee' }]}
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
                      dispatch(removeFromCart(item?.productId));
                    } else {
                      handleDecrement(item);
                    }
                  }}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.counterValue}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => {
                    handleIncrement(item);
                  }}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  imageContainer: {
    height: height * 0.25,
    borderBottomWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  image: {
    width: '90%',
    height: '90%',
    alignSelf: 'center',
    resizeMode: 'contain',
    padding: 5,
  },
  itemSymbol: {
    position: 'absolute',
    width: width * 0.04,
    height: width * 0.04,
    bottom: 10,
    left: 10,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(40, 127, 22, 1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
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
  infoContainer: {
    padding: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
  },
  sellingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  mrp: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  wishlistButton: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 16,
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
    justifyContent: 'center',
    flex: 1,
  },
  saveIconContainer: {
    height: width * 0.085,
    width: 40,
    borderWidth: 2,
    borderColor: '#151515ff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  saveIconImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  deliveryImage: {
    width: width * 0.06,
    height: width * 0.03,
    resizeMode: 'contain',
  },
  cartText: {
    color: '#d63333ff',
    fontWeight: '900',
    fontSize: 18,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
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
});

export default ListComponent;
