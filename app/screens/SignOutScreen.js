import React, { Component } from 'react'
import { View, } from 'react-native'
import { Appbar, Button } from 'react-native-paper';
import firebase from 'react-native-firebase';

export default class SignOutScreen extends React.Component {
    unsubscribe = {}

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentWillMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(() => {
            if (firebase.auth().currentUser)
                this.props.navigation.navigate('App')
            else
                this.props.navigation.navigate('Auth')
        })
        //** make other things before signout? */
        firebase.auth().signOut()
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {firebase.auth().currentUser && <Button icon="warning" mode="contained" onPress={() => { firebase.auth().signOut() }}>LOGOUT FIREBASE</Button>}
            </View>
        );
    }
}
