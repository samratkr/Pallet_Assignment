import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Dropdown from 'react-native-element-dropdown/src/components/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addOrUpdateCartItem } from '../store/reducers/cartReducer';

const { width } = Dimensions.get('window');

const quantityOptions = Array.from({ length: 25 }, (_, i) => ({
  label: `${i + 1} Quantity`,
  value: `${i + 1}`,
}));

export default function QuantitySelector({ item }: { item: any }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find(i => i.productId === item.productId);

  const [value, setValue] = useState<string | null>(null);

  // Sync dropdown with cart quantity
  useEffect(() => {
    if (cartItem) {
      const cartQty = cartItem.quantity.toString();
      if (cartQty !== value) {
        setValue(cartQty);
      }
    }
  }, [cartItem?.quantity]);

  const handleChange = (selectedItem: any) => {
    const selectedQty = selectedItem.value;
    setValue(selectedQty);

    // Always add or update cart item on quantity change
    dispatch(
      addOrUpdateCartItem({
        ...item,
        quantity: parseInt(selectedQty, 10),
      }),
    );
  };

  return (
    <View style={styles.wrapper}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={quantityOptions}
        labelField="label"
        valueField="value"
        placeholder="Select quantity"
        value={value}
        onChange={handleChange}
        maxHeight={300}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: width * 0.085,
  },
  dropdown: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  placeholderStyle: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
});
