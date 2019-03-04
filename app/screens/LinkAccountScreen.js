import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Text, Snackbar } from 'react-native-paper';
import firebase from 'react-native-firebase';
import FacebookLogin from '../components/FacebookLogin'


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

    //load again and route there?
    _onSignInSuccess = (credential) => {
        this.props.navigation.navigate('Loading')
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
                UNLINK PHONE</Button>)
        else if (firebase.auth().currentUser)
            return (<Button
                icon="phone"
                mode="contained"
                style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                onPress={() => this.props.navigation.navigate('LinkPhoneAccount', { title: 'Link you phone', linkAccounts })}
            >
                LINK PHONE</Button>)
        return (<Button
            icon="phone"
            mode="contained"
            style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
            onPress={() => this.props.navigation.navigate('PhoneSignIn', { title: 'Sign-in with your phone' })}
        >
            SIGN-IN WITH PHONE</Button>)

    }

    //must improve on redirects after signin
    //and after link accounts
    //after sigin, must redirect to Loading again?
    //after link still in the same page?

    _renderFacebook = () => {
        provider = 'facebook.com'
        if (this._existProvider(provider))
            return (<FacebookLogin
                text='UNLINK FACEBOOK'
                onError={err => console.log(err)}
                onPress={() => this._unlinkProvider(provider)}
                disabled={this.state.disableUnlink}
            />)
        else if (firebase.auth().currentUser)
            return (<FacebookLogin text='LINK FACEBOOK' onSuccess={ok => console.log('link')} onError={err => console.log(err)} linkAccounts={true} />)
        return (<FacebookLogin text='SIGN-IN WITH FACEBOOK' onSuccess={ok => console.log('signin')} onError={err => console.log(err)} linkAccounts={true} />)
    }

    _unlinkProvider = async (provider) => {
        if (this.state.disableUnlink)
            this._showSnackBar(`Can't unlink your last provider.`)
        else
            firebase.auth().currentUser.unlink(provider)
                .then(() => this._showSnackBar(`Account unlinked`))
                .catch(() => this._showSnackBar(`Can't unlinked account`))
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
        onSignInSuccess = this.props.navigation.getParam('onSignInSuccess')
        linkAccounts = this.props.navigation.getParam('linkAccounts')
        console.log(this.props.navigation.state.params)
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