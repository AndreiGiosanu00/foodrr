import React from 'react';
import { StyleSheet, Button } from 'react-native';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { DrawerContent } from './screens/DrawerContent';
import { Asset } from "expo-asset";
import AppLoading from 'expo-app-loading';

import firebase from "firebase";
import {firebaseConfig} from "./config";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";
import FavoritesScreen from "./screens/FavoritesScreen";
import BottomTabs from "./screens/BottomTabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

const Drawer = createDrawerNavigator();

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/login-background.jpg'),
    ]);

    await Promise.all([...imageAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
          <AppLoading
              startAsync={this._loadAssetsAsync}
              onFinish={() => this.setState({ isReady: true })}
              onError={console.warn}
          />
      );
    }
    return (
        <NavigationContainer>
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="LoadingScreen" component={LoadingScreen} options={{
              headerShown: false
            }}/>
            <Drawer.Screen name="LoginScreen" component={LoginScreen} options={{
              headerShown: false
            }}/>
            <Drawer.Screen name="RegisterScreen" component={RegisterScreen} options={{
              headerShown: false
            }}/>
            <Drawer.Screen name="BottomTabs" component={BottomTabs} options={{
              title: 'Foodrr',
              headerTitleAlign: 'center',
              headerRight: () => (
                  <Icon
                      name="camera"
                      color="#4285F4"
                      size={30}
                      style={{marginRight: 5}}
                      onPress={() => alert('da')}
                  />
              )
            }}/>
          </Drawer.Navigator>
        </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
