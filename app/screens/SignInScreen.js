import React, { Component } from 'react'
import { View, } from 'react-native'
import { Appbar, Button } from 'react-native-paper';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
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

    componentWillMount() {
        LoginManager.logOut();
    }

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
                    USE PHONE</Button>

                <FacebookLogin text='FACEBOOK LOGIN' onSuccess={onSignInSuccess} onError={err => console.log(err)} />

                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                console.log("login has error: " + result.error);
                            } else if (result.isCancelled) {
                                console.log("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
                                        firebase.auth().signInWithCredential(credential)
                                            .then(onSignInSuccess, (err) => console.log(err))
                                    }
                                )
                            }
                        }
                    } />
            </View>
        );
    }
}