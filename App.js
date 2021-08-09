import React from 'react';
import { StyleSheet } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import DashboardAnimation from './screens/DashboardAnimation';
import LoginAnimation from './screens/LoginAnimation';
import RegisterAnimation from './screens/RegisterAnimation';
import { DrawerContent } from './screens/DrawerContent';
import { Asset } from "expo-asset";
import AppLoading from 'expo-app-loading';

import firebase from "firebase";
import {firebaseConfig} from "./config";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

firebase.initializeApp(firebaseConfig);

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
            <Drawer.Screen name="Dashboard" component={DashboardScreen}/>
          </Drawer.Navigator>
        </NavigationContainer>
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginAnimation: LoginAnimation,
  LoginScreen: LoginScreen,
  RegisterAnimation: RegisterAnimation,
  RegisterScreen: RegisterScreen,
  DashboardAnimation: DashboardAnimation,
  DashboardScreen: DashboardScreen
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
