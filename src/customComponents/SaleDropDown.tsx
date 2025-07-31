import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';

const data = [
  { label: 'Sabse Sasta!', value: '1' },
  { label: 'Get it in less price', value: '2' },
  { label: 'Top Value Choice', value: '5' },
  { label: 'Maximum Savings', value: '6' },
  { label: 'Limited Time Deal', value: '10' },
];

export default function SaleDropDown() {
  const [value, setValue] = useState(null);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#7fdc7fff', '#ffffff']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBorder}
      >
        <View style={styles.innerWrapper}>
          <LinearGradient
            colors={['#a3ec87ff', '#e0ffe0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inputContainerGradient}
          >
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select your deal"
              value={value}
              onChange={item => {
                setValue(item.value);
              }}
              renderItem={item => {
                const isSelected = item.value === value;
                return (
                  <LinearGradient
                    colors={
                      isSelected
                        ? ['#6cbb6cff', '#ffffff']
                        : ['#ffffff', '#f0fff0']
                    }
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.itemGradient}
                  >
                    <Text style={styles.itemText}>{item.label}</Text>
                  </LinearGradient>
                );
              }}
            />
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 6,
  },
  innerWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  dropdown: {
    height: 48,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  inputContainerGradient: {
    borderRadius: 6,
    padding: 1,
  },
  dropdownContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  placeholderStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  itemGradient: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});
