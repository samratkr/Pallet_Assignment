import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/reducers/cartReducer';
import { GetProductApiHelper } from '../store/helpers/productApis';
import { AppDispatch } from '../store/store';
import Loader from '../customComponents/Loader';
import SimpleDropDown from '../customComponents/SimpleDropDown';
import { useNavigation } from '@react-navigation/native';
import { singleProduct } from '../store/reducers/productReducer';
// import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = width * 0.65; // 1.5 cards = 65% approx

const ProductListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products);
  const hasMore = useSelector((state: any) => state.product.hasMore);
  const page = useSelector((state: any) => state.product.page);
  const loading = useSelector((state: any) => state.product.loading);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };
  const user = useSelector((state: any) => state?.auth?.user);
  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, products.length - 1);
    scrollToIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(prevIndex);
  };

  const handleSingleProduct = async (item: any) => {
    const result = await dispatch(singleProduct(item));
    if (result) {
      navigation.navigate('ProductDetails');
    }
  };

  const renderItem = ({ item }: any) => {
    const productImage =
      item.image || item?.variants?.[0]?.images?.[0]?.url || null;
    const productName = item.name || item.title || 'No Name';
    const foodType = item?.attributes?.foodType;
    const productPrice =
      item?.variants[0]?.inventorySync?.sellingPrice || 'N/A';
    const mrpPrice =
      item?.variants[0]?.inventorySync?.mrp ?? productPrice ?? 'N/A';

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

              <SimpleDropDown />

              <View style={styles.priceRow}>
                <Text style={styles.sellingPrice}>₹{productPrice}</Text>
                <Text style={styles.mrp}>{mrpPrice}</Text>
              </View>
              <SimpleDropDown />
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.wishlistButton}>
                  {/* <Ionicons name="heart-outline" size={20} color="#f00" /> */}
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
                  {/* <Ionicons name="cart-outline" size={18} color="#fff" style={{ marginLeft: 8 }} /> */}
                </TouchableOpacity>
              </View>
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
    console.error('Visible items:', viewableItems);
    const lastIndex = products.length - 1;
    const isLastVisible = viewableItems.some(
      (item: any) => item.index === lastIndex,
    );

    if (isLastVisible && hasMore && !loading) {
      dispatch(
        GetProductApiHelper({
          page: page.toString(),
          pageSize: '10',
          storeLocationId: 'RLC_83',
        }),
      );
    }
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {user?.name && user?.name}Pallet Shop
        </Text>
        <View style={styles.topButtons}>
          <TouchableOpacity onPress={handlePrevious} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        horizontal
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.productId?.toString() || index.toString()
        }
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        pagingEnabled={false}
        contentContainerStyle={{ paddingHorizontal: CARD_MARGIN }}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        ListFooterComponent={
          loading && hasMore ? <Loader size="small" background={false} /> : null
        }
      />
      <View style={styles.viewCart}>
        <TouchableOpacity
          style={[styles.viewButton]}
          // onPress={() => dispatch(removeFromCart(product.id))}
        >
          <Text style={styles.viewCartText}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    // paddingTop: 20,
  },
  topButtons: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  iconButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
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
  viewCart: {
    position: 'absolute',
    bottom: 30,
    width: width * 0.95,
    alignSelf: 'center',
  },
  viewButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    alignSelf: 'center',
  },
});

export default ProductListScreen;
