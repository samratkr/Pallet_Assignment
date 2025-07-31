import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../store/reducers/cartReducer';
import { RootState } from '../store/store';

const CartScreen: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cart Items</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Button
              title="Remove"
              onPress={() => dispatch(removeFromCart(item.id))}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  title: { fontSize: 18, fontWeight: '500' },
});

export default CartScreen;
