/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    ActivityIndicator,
    Keyboard
} from 'react-native';

import Form from 'react-native-form';
import { Appbar, Button, Snackbar } from 'react-native-paper';
import CountryPicker from 'react-native-country-picker-modal';
import firebase from 'react-native-firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class PhoneScreen extends Component {

    constructor(props) {
        super(props);
        console.log(this.props)
        this.unmount = false;
        this.state = {
            enterCode: false,
            spinner: false,
            country: {
                cca2: 'US',
                callingCode: '1'
            },
            loggedUser: null,
            snackBarMessage: '',
            snackBarVisible: false,
            snackBarAction: null
        };
    }

    componentWillUnmount() {
        this.unmount = true;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'Phone Sign-in')
        }
    };

    _getCode = () => {
        this.setState({ spinner: true }, this.refs.form.refs.textInput.blur());
        const { phoneNumber } = this.refs.form.getValues()
        const phoneNumberWithCountryCode = `+${this.state.country.callingCode} ${phoneNumber}`
        this.unsubscribe = firebase.auth()
            .verifyPhoneNumber(phoneNumberWithCountryCode)
            .on('state_changed', (phoneAuthSnapshot) => {
                // How you handle these state events is entirely up to your ui flow and whether
                // you need to support both ios and android. In short: not all of them need to
                // be handled - it's entirely up to you, your ui and supported platforms.

                // E.g you could handle android specific events only here, and let the rest fall back
                // to the optionalErrorCb or optionalCompleteCb functions
                switch (phoneAuthSnapshot.state) {
                    // ------------------------
                    //  IOS AND ANDROID EVENTS
                    // ------------------------
                    case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                        console.log('code sent');
                        // on ios this is the final phone auth state event you'd receive
                        // so you'd then ask for user input of the code and build a credential from it
                        // as demonstrated in the `signInWithPhoneNumber` example above
                        this.setState({
                            confirmResult: phoneAuthSnapshot,
                            spinner: false,
                            enterCode: true,
                        },
                            this.refs.form.refs.textInput.focus())
                        break;
                    case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                        console.log('verification error');
                        console.log(phoneAuthSnapshot.error);
                        this._showSnackBar(phoneAuthSnapshot.error.message, {
                            label: 'Ok',
                            onPress: () => {
                                this.setState({ spinner: false });
                                this && this.refs.form.refs.textInput.focus();
                            },
                        })
                        break;

                    // ---------------------
                    // ANDROID ONLY EVENTS
                    // ---------------------
                    case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                        console.log('auto verify on android timed out');
                        // proceed with your manual code input flow, same as you would do in
                        // CODE_SENT if you were on IOS
                        if (!this.unmount) {
                            this.setState({
                                confirmResult: phoneAuthSnapshot,
                                spinner: false,
                                enterCode: true,
                            },
                                this.refs.form.refs.textInput.focus())
                        }
                        break;
                    case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
                        // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                        const { verificationId, code } = phoneAuthSnapshot;
                        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
                        this._signInOrLinkAccount(credential)
                        break;
                }
            });
    }

    _signInOrLinkAccount = (credential) => {
        const onSignInSuccess = this.props.navigation.getParam('onSignInSuccess', false)
        const linkAccounts = this.props.navigation.getParam('linkAccounts', false)
        if (firebase.auth().currentUser && linkAccounts) {
            firebase.auth().currentUser.linkWithCredential(credential)
                .then((ok) => {
                    if (onSignInSuccess)
                        onSignInSuccess(credential)
                })
                .catch(error => this._showCodeError(error))
        } else {
            firebase.auth().signInWithCredential(credential)
                .then((ok) => {
                    if (onSignInSuccess)
                        onSignInSuccess(credential)
                })
                .catch(error => this._showCodeError(error))
        }
    }

    _showCodeError = (error) => {
        this._showSnackBar(error.message, {
            label: 'Ok',
            onPress: () => {
                this.setState({ spinner: false });
                this && this.refs.form.refs.textInput.focus();
            },
        })
    }

    _showSnackBar = (snackBarMessage, snackBarAction) => {
        this.setState({ snackBarMessage, snackBarAction, snackBarVisible: true })
    }

    _verifyCode = async () => {
        this.setState({ spinner: true }, this.refs.form.refs.textInput.blur());
        try {
            const { confirmResult } = this.state;
            const { code } = this.refs.form.getValues()
            if (confirmResult) {
                const credential = await firebase.auth.PhoneAuthProvider.credential(confirmResult.verificationId, code)
                this._signInOrLinkAccount(credential)
            } else
                this.setState({ spinner: false });
        } catch (err) {
            this._showSnackBar(err.message)
        }
    }

    _onChangeText = (val) => {
        if (!this.state.enterCode) return;
        if (val.length === MAX_LENGTH_CODE)
            this._verifyCode();
    }

    _tryAgain = () => {
        this.refs.form.refs.textInput.setNativeProps({ text: '' })
        this.refs.form.refs.textInput.focus();
        this.setState({ enterCode: false, spinner: false });
    }

    _getSubmitAction = () => {
        this.state.enterCode ? this._verifyCode() : this._getCode();
    }

    _changeCountry = (country) => {
        this.setState({ country });
        this.refs.form.refs.textInput.focus();
    }

    _renderFooter = () => {

        if (this.state.enterCode)
            return (
                <View>
                    <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
                        Enter the wrong number or need a new code?
          </Text>
                </View>
            );

        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    _renderCountryPicker = () => {

        if (this.state.enterCode)
            return (
                <View />
            );

        return (
            <CountryPicker
                ref={'countryPicker'}
                closeable
                style={styles.countryPicker}
                onChange={this._changeCountry}
                cca2={this.state.country.cca2}
                showCallingCode={true}
                styles={countryPickerCustomStyles}
                translation='eng' />
        );

    }

    _renderCallingCode = () => {
        if (this.state.enterCode)
            return (
                <View />
            );
        return (
            <View style={styles.callingCodeView}>
                <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
            </View>
        );

    }

    _renderSnackBar = () => {
        return (
            <Snackbar
                visible={this.state.snackBarVisible}
                onDismiss={() => this.setState({ snackBarVisible: false })}
                action={this.state.snackBarAction}
            >
                {this.state.snackBarMessage}
            </Snackbar>
        )
    }

    render() {
        let headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
        let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
        let textStyle = this.state.enterCode ? {
            height: 50,
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: 'Courier'
        } : {};

        return (

            <View style={styles.container}>

                <Text style={styles.header}>{headerText}</Text>

                <Form ref={'form'} style={styles.form}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                        {/** fix 60 px to stop button/children moving around */}
                        <View style={{ minHeight: 50 }}></View>

                        {this._renderCountryPicker()}
                        {this._renderCallingCode()}
                        <TextInput
                            ref={'textInput'}
                            name={this.state.enterCode ? 'code' : 'phoneNumber'}
                            type={'TextInput'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={this._onChangeText}
                            placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={[styles.textInput, textStyle]}
                            returnKeyType='go'
                            autoFocus={true}
                            placeholderTextColor={brandColor}
                            selectionColor={brandColor}
                            maxLength={this.state.enterCode ? 6 : 20}
                            onSubmitEditing={this._getSubmitAction}
                            blurOnSubmit={true}
                        />
                    </View>
                    {/**add-a-photo icon use the same color of the button just to make a fake space to ActivityIcon */}
                    <Button mode="contained" disabled={this.state.spinner} style={{ marginTop: 20, }} icon={{ source: "add-a-photo", color: '#744BAC' }} loading={this.state.spinner} onPress={this._getSubmitAction} color="#744BAC">{buttonText}</Button>
                    {this._renderFooter()}
                </Form>
                {this._renderSnackBar()}
            </View>
        );
    }
}

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
const brandColor = '#744BAC';

const styles = StyleSheet.create({
    countryPicker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1
    },
    header: {
        textAlign: 'center',
        marginTop: 60,
        fontSize: 22,
        margin: 20,
        color: '#4A4A4A',
    },
    form: {
        margin: 20
    },
    textInput: {
        padding: 0,
        margin: 0,
        flex: 1,
        fontSize: 20,
        color: brandColor
    },
    button: {
        marginTop: 20,
        height: 50,
        backgroundColor: brandColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Helvetica',
        fontSize: 16,
        fontWeight: 'bold'
    },
    wrongNumberText: {
        margin: 10,
        fontSize: 14,
        textAlign: 'center'
    },
    disclaimerText: {
        marginTop: 30,
        fontSize: 12,
        color: 'grey'
    },
    callingCodeView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    callingCodeText: {
        fontSize: 20,
        color: brandColor,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        paddingRight: 10
    }
});