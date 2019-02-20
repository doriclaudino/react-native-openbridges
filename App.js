/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import BridgeListScreen from './app/screens/BridgeListScreen';
import BridgeDetailScreen from './app/screens/BridgeDetailScreen';
import LoginScreen from './app/screens/LoginScreen';
import PhoneScreen from './app/screens/PhoneScreen';
import { Provider } from 'react-redux'
import { store } from './app/store/BridgeStore';

const LoginStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    params: {
      title: 'Login',
    }
  }
});

const PhoneAuthStack = createStackNavigator({
  PhoneScreen: {
    screen: PhoneScreen,
    params: {
      title: 'PhoneScreen',
    }
  },
});

const BridgeStack = createStackNavigator({
  List: {
    screen: BridgeListScreen,
    params: {
      title: 'Bridges',
    }
  },
  Detail: {
    screen: BridgeDetailScreen,
  }
});

const DrawerNavigation = createDrawerNavigator({
  Bridges: BridgeStack,
  Login: LoginStack,
  PhoneAuth: PhoneAuthStack,
},
  {
    initialRouteName: 'Bridges'
  });


const AppContainer = createAppContainer(DrawerNavigation);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return <Provider store={store}><AppContainer /></Provider>
  }
}


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
