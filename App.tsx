/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 * 
 * @format
 */

import React, { Component } from 'react';
import { Provider as ReduxProvider} from 'react-redux'
import { store } from './app/store/BridgeStore';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigation from './app/navigation/RootNavigation'
import firebase from 'react-native-firebase';

class App extends Component {
  componentWillUnmount() {
    firebase.database().ref('bridges').off('value')

    const { currentUser } = firebase.auth()
    if (currentUser) {
      firebase.database()
        .ref('ui')
        .child(currentUser.uid)
        .off('value')
    }
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


