import React from 'react'
import { Button } from 'react-native-paper';
import { AccessToken, LoginManager, LoginResult } from 'react-native-fbsdk';
import firebase, { RNFirebase } from 'react-native-firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { FacebookLoginProps } from 'components/FacebookLogin';

export default class FacebookLogin extends React.Component<FacebookLoginProps> {
    _signInOrLink = async () => {
        try {
            LoginManager.setLoginBehavior('native_only');
            await LoginManager.logInWithReadPermissions(['public_profile', 'email'])
                .then((result) => this._linkFacebookResult(result),
                    (err) => this._onError(err))
        } catch (err) {
            try {
                LoginManager.setLoginBehavior('web_only');
                await LoginManager.logInWithReadPermissions(['public_profile', 'email'])
                    .then((result) => this._linkFacebookResult(result),
                        (err) => this._onError(err))
            } catch (err) {
                this._onError(err)
            }
        }
    }

    _linkFacebookResult = (result: LoginResult) => {
        if (result.isCancelled) {
            console.log("login is cancelled.");
        } else {
            AccessToken.getCurrentAccessToken()
                .then((data) => {
                    const credential = firebase.auth.FacebookAuthProvider.credential(data!.accessToken)
                    const { currentUser } = firebase.auth()
                    if (currentUser && this.props.linkAccounts)
                        currentUser.linkWithCredential(credential)
                            .then((ok) => this._onSuccess(ok),
                                (err) => this._onError(err))
                    else
                        firebase.auth().signInWithCredential(credential)
                            .then((ok) => this._onSuccess(ok),
                                (err) => this._onError(err))
                })
        }
    }

    _onError = (err: any) => {
        if (this.props.onError) {
            this.props.onError(err)
        }
    }

    _onSuccess = (ok: RNFirebase.UserCredential) => {
        if (this.props.onSuccess) {
            this.props.onSuccess(ok)
        }
    }

    render() {
        const {
            onPress = this._signInOrLink,
            ...rest
        } = this.props;

        return (<Button
            icon={() => <MaterialCommunityIcons name="facebook" size={24} color="white" />}
            mode="contained"
            style={{ width: 190, backgroundColor: '#3b5998', marginVertical: 5, }}
            onPress={onPress}
            {...rest}
        ></Button>)
    }

}


