// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
// import {
//   Camera,
//   useCameraDevices,
//   useFrameProcessor,
// } from 'react-native-vision-camera';
// import { runOnJS } from 'react-native-worklets';
// import { BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner';

// const BarcodeScannerScreen = () => {
//   const navigation = useNavigation();
//   const [barcodeValue, setBarcodeValue] = useState<string | null>(null);
//   const devices = useCameraDevices();
//   const device = devices.back;

//   const frameProcessor = useFrameProcessor(frame => {
//     'worklet';
//     const barcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS]);
//     if (barcodes.length > 0) {
//       const value = barcodes[0].displayValue ?? '';
//       runOnJS(setBarcodeValue)(value);
//     }
//   }, []);

//   if (!device) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#00BFA5" />
//         <Text>Loading camera...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {device && (
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           frameProcessor={frameProcessor}
//         />
//       )}
//       <View style={styles.overlay}>
//         <Text style={styles.title}>
//           {barcodeValue ? `Scanned: ${barcodeValue}` : 'Scan a barcode...'}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default BarcodeScannerScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'space-between',
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     paddingVertical: 32,
//   },
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   backButton: {
//     marginRight: 12,
//   },
//   title: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   scannerBoxContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scannerBox: {
//     width: 250,
//     height: 250,
//     borderWidth: 3,
//     borderColor: '#00BFA5',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   resultBox: {
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     alignSelf: 'center',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 30,
//   },
//   resultText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
