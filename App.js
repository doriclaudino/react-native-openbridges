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
import { createStackNavigator, createAppContainer } from "react-navigation";
import BridgeListScreen from './app/screens/BridgeListScreen';
import BridgeDetailScreen from './app/screens/BridgeDetailScreen';



const BridgeStack = createStackNavigator({
  Home: {
    screen: BridgeListScreen,
  },
  BridgeDetail: {
    screen: BridgeDetailScreen,
  }
});


const AppContainer = createAppContainer(BridgeStack);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return <AppContainer />;
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
