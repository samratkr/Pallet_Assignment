import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SimpleDropDown from '../customComponents/SimpleDropDown';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from '../store/reducers/cartReducer';
import { singleProduct } from '../store/reducers/productReducer';
import { RootState } from '../store/store';
import SaleDropDown from '../customComponents/SaleDropDown';
import QuantitySelector from '../customComponents/QuantitySelector';

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = width * 0.65;
const CartScreen: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const handleSingleProduct = async (item: any) => {
    const result = await dispatch(singleProduct(item));
    if (result) {
      navigation.navigate('ProductDetails');
    }
  };

  console.error(cartItems?.length, 'cartItemscartItems');

  const quantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item: any) => {
      map[item?.productId] = item?.quantity;
    });
    return map;
  }, [cartItems]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, cartItems.length - 1);
    scrollToIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(prevIndex);
  };

  const renderItem = ({ item }: any) => {
    const quantity = quantityMap[item?.productId] || 0;

    const productImage =
      item.image || item?.variants?.[0]?.images?.[0]?.url || null;
    const productName = item.name || item.title || 'No Name';
    const foodType = item?.attributes?.foodType;
    const productPrice =
      item?.variants[0]?.inventorySync?.sellingPrice || 'N/A';
    const mrpPrice =
      item?.variants[0]?.inventorySync?.mrp ?? productPrice ?? 'N/A';

    const handleIncrement = (product: any) => {
      const newQuantity = quantity + 1;
      if (quantity === 0) {
        dispatch(addToCart(product));
      } else {
        dispatch(
          updateQuantity({
            productId: product.productId,
            quantity: newQuantity,
          }),
        );
      }
    };

    const handleDecrement = (product: any) => {
      const newQuantity = quantity - 1;
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
      <View style={styles.cardWrapper}>
        <View style={styles.container}>
          <ScrollView>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => handleSingleProduct(item)}
            >
              <Image
                source={
                  productImage
                    ? {
                        uri: productImage,
                      }
                    : item?.variants?.[0]?.images?.[0]?.url
                    ? item?.variants?.[0]?.images?.[0]?.url
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
              {/* <Ionicons name="time-outline" size={14} color="#fff" /> */}
              <Text style={styles.deliveryText}> 2 hrs</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.brand}>Fresho</Text>
              <Text style={styles.productName}>
                {productName.length > 40
                  ? productName.substring(0, 67) + '...'
                  : productName}
              </Text>

              <QuantitySelector item={item} />

              <View style={styles.priceRow}>
                <Text style={styles.sellingPrice}>₹{productPrice}</Text>
                <Text style={styles.mrp}>{mrpPrice}</Text>
              </View>
              <SaleDropDown />
              {/* <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.wishlistButton}>
                 </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addToCartButton,
                    !item?.inStock && { borderColor: '#eee' }, // Example style
                  ]}
                  disabled={!mrpPrice && !productPrice}
                  onPress={() => dispatch(addToCart(item))}
                >
                  <Text
                    style={[
                      styles.cartText,
                      !item?.inStock && { color: '#eee' },
                    ]}
                  >
                    Add
                  </Text>
                 </TouchableOpacity> */}
              {/* </View> */}

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
                    style={[
                      styles.cartText,
                      !item?.inStock && { color: '#eee' },
                    ]}
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
          </ScrollView>
        </View>
      </View>
    );
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const lastIndex = cartItems.length - 1;
    const isLastVisible = viewableItems.some(
      (item: any) => item.index === lastIndex,
    );
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.iconButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.topButtons}>
          <TouchableOpacity onPress={handlePrevious} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <FlatList
          horizontal
          ref={flatListRef}
          data={cartItems}
          contentContainerStyle={{ paddingVertical: CARD_MARGIN * 2 }}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.productId?.toString() || index.toString()
          }
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig}
        />
      </View>

      <View style={styles.checkOut}>
        <TouchableOpacity
          style={styles.checkOutButton}
          // onPress={handleViewCard}
        >
          <Text style={styles.checkOutText}>Check-Out - ₹ 150</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  title: { fontSize: 18, fontWeight: '500' },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
    width: width * 0.675,
  },
  imageContainer: {
    height: height * 0.3,
    position: 'relative',
    borderWidth: 2,
    borderBottomWidth: 2,
    borderRadius: 6,
    borderColor: '#eee',
    margin: 15,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
    zIndex: 10,
    justifyContent: 'center',
  },
  topButtons: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
    gap: 10,
  },
  iconButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  iconButton: {
    padding: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e3e3e3ff',
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },

  backButton: {
    padding: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e3e3e3ff',
    borderRadius: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  image: {
    width: '90%',
    height: '90%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignSelf: 'center',
  },
  itemSymbol: {
    position: 'absolute',
    width: width * 0.04,
    height: width * 0.04,
    bottom: 10,
    left: 10,
    alignSelf: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(40, 127, 22, 1)',
    paddingHorizontal: 10,
    paddingTop: 3,
    paddingBottom: 5,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deliveryTime: {
    right: 15,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  deliveryText: {
    color: '#fff',
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
    height: height * 0.04,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    width: width * 0.5,
    justifyContent: 'center',
  },
  cartText: {
    color: '#d63333ff',
    fontWeight: '900',
    fontSize: 20,
  },
  checkOut: {
    position: 'absolute',
    bottom: 30,
    width: width * 0.92,
    alignSelf: 'center',
  },
  checkOutButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  checkOutText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    alignSelf: 'center',
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

export default CartScreen;
