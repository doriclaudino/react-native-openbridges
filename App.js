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
import { Provider as ReduxProvider, connect } from 'react-redux'
import { store } from './app/store/BridgeStore';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigation from './app/navigation/RootNavigation'
import SignInScreen from './app/screens/SignInScreen'
import firebase from 'react-native-firebase';

class App extends Component {
  componentWillUnmount() {
    firebase.database().ref('bridges').off('value')

    const { uid } = firebase.auth().currentUser
    firebase.database()
      .ref('ui')
      .child(uid)
      .off('value')
    console.log('firebase listener closed')
  }

  render() {
    return (<PaperProvider>
      <RootNavigation /> 
    </PaperProvider>)
  }
}

export default class AppContainer extends React.Component {
  render() {
    return (
      <ReduxProvider store={store}>
        <App {...this.props} />
      </ReduxProvider>
    );
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
