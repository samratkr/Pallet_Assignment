import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ListComponent from '../customComponents/ListComponent';
import Loader from '../customComponents/Loader';
import { GetProductApiHelper } from '../store/helpers/productApis';
import { AppDispatch } from '../store/store';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_HEIGHT = height * 0.66;

const ProductListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: any) => state.product.products);
  const hasMore = useSelector((state: any) => state.product.hasMore);
  const page = useSelector((state: any) => state.product.page);
  const loading = useSelector((state: any) => state.product.loading);
  const flatListRef = useRef<FlatList>(null);
  const user = useSelector((state: any) => state?.auth?.user);
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const cartItems = useSelector((state: any) => state?.cart?.items);

  const handleNext = () => {
    const nextIndex = Math.min(currentIndex + 1, products.length - 1);
    scrollToIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(prevIndex);
  };

  const renderItem = ({ item }: any) => {
    return (
      <View>
        <ListComponent item={item} />
      </View>
    );
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
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

  const handleViewCard = () => {
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {user?.name ? user.name + `'s ` : ''}Pallet Shop
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
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.productId?.toString() || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: CARD_MARGIN * 2 }}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        ListFooterComponent={
          loading && hasMore ? <Loader size="small" background={false} /> : null
        }
      />
      {cartItems?.length > 0 && (
        <View style={styles.viewCart}>
          <TouchableOpacity style={styles.viewButton} onPress={handleViewCard}>
            <Text style={styles.viewCartText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardWrapper: {
    marginVertical: CARD_MARGIN,
    paddingHorizontal: 10,
    width: '100%',
  },
  container: {
    height: CARD_HEIGHT,
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
    width: '100%',
  },
  iconButton: {
    padding: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e3e3e3ff',
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
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
    position: 'absolute',
    top: height * 0.3 + 30,
    marginRight: 20,
  },
  deliveryText: {
    color: '#fff',
    fontSize: 12,
  },
  infoContainer: {
    padding: 16,
    marginTop: 20,
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
