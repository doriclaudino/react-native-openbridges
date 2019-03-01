import React, { Component } from 'react'
import { View, } from 'react-native'
import { Appbar, Button } from 'react-native-paper';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { createUserUI } from '../actions';

const mapDispatchToProps = { createUserUI }

class SignInScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: (
                <Appbar.Header>
                    <Appbar.Content title={navigation.getParam('title', 'default')} />
                </Appbar.Header>
            )
        })
    };
    unsubscribe = {}

    componentWillUnmount() {
        this.unsubscribe()
    }

    componentWillMount() {
        //logout user from FacebookButton?
        LoginManager.logOut();

        this.unsubscribe = firebase.auth().onAuthStateChanged(() => {
            if (firebase.auth().currentUser) {
                this.props.createUserUI()
                    .then(() => this.props.navigation.navigate('App'))

            }
            else
                this.props.navigation.navigate('Auth')
        })
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Button
                    icon="phone"
                    mode="contained"
                    onPress={() => this.props.navigation.navigate('PhoneSignIn')}
                    style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                >
                    USE PHONE</Button>
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
                                        if (firebase.auth().currentUser) {
                                            firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
                                                .then((ok) => console.log(ok), (err) => console.log(err))
                                        } else {
                                            firebase.auth().signInWithCredential(credential)
                                                .then((ok) => console.log(ok), (err) => console.log(err))
                                        }
                                    }
                                )
                            }
                        }
                    } />

                {firebase.auth().currentUser && <Button icon="warning" mode="contained" onPress={() => { firebase.auth().signOut() }}>LOGOUT FIREBASE</Button>}
            </View>
        );
    }
}

export default connect(null, mapDispatchToProps)(SignInScreen)
