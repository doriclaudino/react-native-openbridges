import React, { Component } from 'react'
import { View, } from 'react-native'
import { Appbar, Button } from 'react-native-paper';
import firebase from 'react-native-firebase';
import FacebookLogin from '../components/FacebookLogin'

export default class SignInScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: (
                <Appbar.Header>
                    <Appbar.Content title={navigation.getParam('title', 'default')} />
                </Appbar.Header>
            )
        })
    };

    render() {
        onSignInSuccess = this.props.navigation.getParam('onSignInSuccess')
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Button
                    icon="phone"
                    mode="contained"
                    onPress={() => this.props.navigation.navigate('PhoneSignIn', { title: 'Phone Sign-In', onSignInSuccess })}
                    style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                >
                    with phone</Button>
                <FacebookLogin text='with Facebook' onSuccess={onSignInSuccess} onError={err => console.log(err)} />                
            </View>
        );
    }
}