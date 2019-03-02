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

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'Phone Sign-in')
        }
    };

    _getCode = () => {
        this.setState({ spinner: true }, this.refs.form.refs.textInput.blur());
        try {
            const { phoneNumber } = this.refs.form.getValues()
            const phoneNumberWithCountryCode = `+${this.state.country.callingCode} ${phoneNumber}`
            firebase.auth().signInWithPhoneNumber(phoneNumberWithCountryCode, true)
                .then(confirmResult => {
                    this.setState({
                        confirmResult,
                        spinner: false,
                        enterCode: true,
                    },
                        this.refs.form.refs.textInput.focus())
                })
                .catch(error => this._showSnackBar(error.message, {
                    label: 'Ok',
                    onPress: () => {
                        this.setState({ spinner: false });
                        this && this.refs.form.refs.textInput.focus();
                    },
                }))
        } catch (err) {
            this._showSnackBar(err.message)
        }
    }

    _showSnackBar = (snackBarMessage, snackBarAction) => {
        this.setState({ snackBarMessage, snackBarAction, snackBarVisible: true })
    }

    _verifyCode = async () => {
        onSignInSuccess = this.props.navigation.getParam('onSignInSuccess')
        linkAccounts = this.props.navigation.getParam('linkAccounts')
        this.setState({ spinner: true }, this.refs.form.refs.textInput.blur());
        try {
            const { confirmResult } = this.state;
            const { code } = this.refs.form.getValues()
            if (confirmResult) {
                const credential = await firebase.auth.PhoneAuthProvider.credential(confirmResult.verificationId, code)
                if (firebase.auth().currentUser && linkAccounts) {
                    firebase.auth().currentUser.linkWithCredential(credential)
                        .then((ok) => {
                            onSignInSuccess();
                        })
                } else
                    confirmResult.confirm(code)
                        .then((user) => {
                            this._showSnackBar('You have successfully verified your phone number');
                            onSignInSuccess();
                        })
                        .catch((error) => {
                            this._showSnackBar(error.message, {
                                label: 'Ok',
                                onPress: () => {
                                    this.setState({ spinner: false });
                                    this && this.refs.form.refs.textInput.focus();
                                },
                            })
                        })
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