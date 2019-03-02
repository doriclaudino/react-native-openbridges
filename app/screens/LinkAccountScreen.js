import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Button, Text, Snackbar } from 'react-native-paper';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


export default class LinkAccountScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            providers: [],
            disableUnlink: false,
            snackBarVisible: false,
            snackBarMessage: '',
        }
        Snackbar.DURATION_SHORT = 2000
    }

    unsubscribe = {}

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillMount() {
        const { currentUser } = firebase.auth()
        this.setState({
            disableUnlink: currentUser.providerData.length === 1,
            providers: currentUser.providerData.map(provider => provider.providerId)
        })

        this.unsubscribe = firebase.auth().onUserChanged((user) => {
            if (user) {
                const { currentUser } = firebase.auth()
                this.setState({
                    disableUnlink: currentUser.providerData.length === 1,
                    providers: currentUser.providerData.map(provider => provider.providerId)
                })
            }
        })
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    })


    _existProvider(name) {
        return this.state.providers.indexOf(name) > -1
    }


    _onSignInSuccess = credential => {
        this.props.navigation.goBack()
    }

    _renderPhone = () => {
        provider = 'phone'
        linkAccounts = this.props.navigation.getParam('linkAccounts', false)

        if (this._existProvider(provider))
            return (<Button
                disabled={this.state.disableUnlink}
                icon="phone"
                mode="contained"
                onPress={() => this._unlinkProvider('phone')}
                style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
            >
                UNLINK USE PHONE</Button>)
        else
            return (<Button
                icon="phone"
                mode="contained"
                style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                onPress={() => this.props.navigation.navigate('LinkPhoneAccount', { title: 'Link you phone', onSignInSuccess: this._onSignInSuccess, linkAccounts })}
            >
                LINK USE PHONE</Button>)
    }

    _renderFacebook = () => {
        provider = 'facebook.com'
        if (this._existProvider(provider))
            return (<Button
                disabled={this.state.disableUnlink}
                icon={() => <MaterialCommunityIcons name="facebook" size={24} color="white" />}
                mode="contained"
                style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                onPress={() => this._unlinkProvider(provider)}
            >
                UNLINK FACEBOOK</Button>)
        else
            return (<Button
                icon={() => <MaterialCommunityIcons name="facebook" size={24} color="white" />}
                mode="contained"
                style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                onPress={this._linkFacebook}
            >
                LINK FACEBOOK</Button>)
    }

    _linkFacebook = async () => {
        let result;
        try {
            LoginManager.setLoginBehavior('NATIVE_ONLY');
            result = await LoginManager.logInWithReadPermissions(['public_profile', 'email'])
                .then(result => this._linkFacebookResult(result))
        } catch (error) {
            LoginManager.setLoginBehavior('WEB_ONLY');
            result = await LoginManager.logInWithReadPermissions(['public_profile', 'email'])
                .then(result => this._linkFacebookResult(result))
        }
    }

    _unlinkProvider = async (provider) => {
        if (this.state.disableUnlink)
            this._showSnackBar(`Can't unlink your last provider.`)
        else
            firebase.auth().currentUser.unlink(provider)
                .then(() => this._showSnackBar(`Account unlinked`))
                .catch(() => this._showSnackBar(`Can't unlinked account`))
    }

    _linkFacebookResult = (result) => {
        if (result.isCancelled) {
            console.log("login is cancelled.");
        } else {
            AccessToken.getCurrentAccessToken().then(
                (data) => {
                    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
                    if (firebase.auth().currentUser) {
                        firebase.auth()
                            .currentUser.linkWithCredential(credential)
                            .then((ok) => this._showSnackBar('Account linked'),
                                (err) => console.log(err))
                    }
                }
            )
        }
    }

    _showSnackBar = (snackBarMessage, snackBarAction) => {
        this.setState({ snackBarMessage, snackBarAction, snackBarVisible: true })
    }

    _renderSnackBar = () => {
        return (
            <Snackbar
                visible={this.state.snackBarVisible}
                onDismiss={() => this.setState({ snackBarVisible: false })}
                action={this.state.snackBarAction}
                duration={Snackbar.DURATION_SHORT}
            >
                {this.state.snackBarMessage}
            </Snackbar>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {this._renderPhone()}
                {this._renderFacebook()}
                {this._renderSnackBar()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    disclaimerText: {
        marginTop: 30,
        fontSize: 12,
        color: 'grey'
    }
})