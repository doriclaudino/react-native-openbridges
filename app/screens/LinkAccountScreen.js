import React from 'react'
import { View } from 'react-native'
import { Button, Snackbar } from 'react-native-paper';
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

    _onPhoneLinkSuccess = () => {
        this.props.navigation.navigate('Loading', { linkAccounts: true })
    }

    _renderPhone = (linkAccounts, onSignInSuccess) => {
        provider = 'phone'
        return (<View>
            {
                this._existProvider(provider) &&
                <Button
                    disabled={this.state.disableUnlink}
                    icon="phone"
                    mode="contained"
                    onPress={() => this._unlinkProvider('phone')}
                    style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                >
                    UNLINK PHONE</Button>
            }
            {
                firebase.auth().currentUser && !this._existProvider(provider) &&
                <Button
                    icon="phone"
                    mode="contained"
                    style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                    onPress={() => this.props.navigation.navigate('LinkPhoneAccount', { title: 'Link you phone', linkAccounts, onSignInSuccess: this._onPhoneLinkSuccess })}
                >
                    LINK PHONE</Button>
            }
            {
                !firebase.auth().currentUser &&
                <Button
                    icon="phone"
                    mode="contained"
                    style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
                    onPress={() => this.props.navigation.navigate('PhoneSignIn', { title: 'Sign-in with your phone', onSignInSuccess })}
                >
                    WITH PHONE</Button>
            }
        </View>)
    }

    _renderFacebook = (linkAccounts, onSignInSuccess) => {
        provider = 'facebook.com'
        return (
            <View>
                {
                    this._existProvider(provider) &&
                    <FacebookLogin
                        text='UNLINK FACEBOOK'
                        onPress={() => this._unlinkProvider(provider)}
                        disabled={this.state.disableUnlink}
                    />
                }
                {
                    firebase.auth().currentUser && !this._existProvider(provider) &&
                    <FacebookLogin
                        text='LINK FACEBOOK'
                        onSuccess={() => this._showSnackBar(`Account linked`)}
                        onError={err => this._showSnackBar(err.message)}
                        linkAccounts
                    />
                }
                {
                    !firebase.auth().currentUser &&
                    <FacebookLogin
                        text='WITH FACEBOOK'
                        onSuccess={ok => {
                            console.log('signed, credential: ', ok);
                            if (onSignInSuccess)
                                onSignInSuccess()
                        }}
                        onError={err => this._showSnackBar(err.message)}
                    />
                }
            </View>
        )
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
                {this._renderPhone(linkAccounts, onSignInSuccess)}
                {this._renderFacebook(linkAccounts, onSignInSuccess)}
                {this._renderSnackBar()}
            </View>
        );
    }
}

