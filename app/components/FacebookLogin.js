import React, { Component } from 'react'
import { Button, Text } from 'react-native-paper';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class FacebookLogin extends React.Component {
        _signInOrLink = async () => {
        let result;
        try {
            LoginManager.setLoginBehavior('NATIVE_ONLY');
            result = await LoginManager.logInWithReadPermissions(['public_profile', 'email'])
                .then(result => this._linkFacebookResult(result))
        } catch (err) {
            try {
                LoginManager.setLoginBehavior('WEB_ONLY');
                result = await LoginManager.logInWithReadPermissions(['public_profile', 'email'])
                    .then(result => this._linkFacebookResult(result))
            } catch (err) {
                this._onError(err)
            }
        }
    }

    _linkFacebookResult = (result) => {
        if (result.isCancelled) {
            console.log("login is cancelled.");
        } else {
            AccessToken.getCurrentAccessToken()
                .then((data) => {
                    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
                    if (firebase.auth().currentUser && this.props.linkAccounts)
                        firebase.auth()
                            .currentUser.linkWithCredential(credential)
                            .then((ok) => this._onSuccess(ok),
                                (err) => this._onError(err))
                    else
                        firebase.auth().signInWithCredential(credential)
                            .then((ok) => this._onSuccess(ok),
                                (err) => this._onError(err))
                })
        }
    }

    _onError = (err) => {
        if (this.props.onError) {
            this.props.onError(err)
        }
    }

    _onSuccess = (ok) => {
        if (this.props.onSuccess) {
            this.props.onSuccess(ok)
        }
    }

    render() {
        return (<Button
            icon={() => <MaterialCommunityIcons name="facebook" size={24} color="white" />}
            mode="contained"
            style={{ width: 190, backgroundColor: '#3b5998', marginVertical: 5, }}
            onPress={typeof this.props.onPress === 'function' ? this.props.onPress : this._signInOrLink}
            {...this.props}
        >
            {this.props.text}</Button>)
    }

}


