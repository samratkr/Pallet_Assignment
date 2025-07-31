import React from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from './src/navigator/AppNavigation';
import {store} from './src/store/store';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
