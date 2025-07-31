import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: '1 Quantity', value: '1' },
  { label: '2 Quantity', value: '2' },
];

export default function SimpleDropDown() {
  const [value, setValue] = useState(null);

  return (
    <View style={styles.wrapper}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select quantity"
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 1000,
    marginBottom: 15,
    marginTop: 5,
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
    fontSize: 16,
    color: '#888',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
});
