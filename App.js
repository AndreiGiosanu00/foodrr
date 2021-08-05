import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import { Asset } from "expo-asset";
import AppLoading from 'expo-app-loading';

import firebase from "firebase";
import {firebaseConfig} from "./config";

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
    return <AppNavigator />;
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  RegisterScreen: RegisterScreen,
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
