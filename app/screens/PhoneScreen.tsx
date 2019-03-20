/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform
} from 'react-native'
import { Button, Snackbar } from 'react-native-paper'
import CountryPicker, { CallingCode, CCA2Code } from 'react-native-country-picker-modal'
import firebase, { RNFirebase, AuthCredential } from 'react-native-firebase'
import { NavigationScreenProps, NavigationParams } from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export interface Country {
  callingCode: CallingCode
  cca2: CCA2Code
}

interface State {
  enterCode: boolean
  spinner: boolean
  country: Country
  snackBarMessage?: string
  snackBarAction?: object | any
  snackBarVisible: boolean
  confirmResult: RNFirebase.PhoneAuthSnapshot | undefined,
  textInputValue: string,
}

export default class PhoneScreen extends React.Component<NavigationScreenProps, State> {
  unmount = false
  unsubscribe: RNFirebase.PhoneAuthListener | undefined = undefined
  state: State = {
    enterCode: false,
    spinner: false,
    country: {
      callingCode: '1',
      cca2: 'US',
    },
    snackBarMessage: '',
    snackBarVisible: false,
    snackBarAction: undefined,
    confirmResult: undefined,
    textInputValue: '',
  }
  textInput = React.createRef<TextInput>()

  componentWillUnmount() {
    this.unmount = true
  }

  static navigationOptions = ({ navigation }: NavigationParams) => {
    return {
      title: navigation.getParam('title', 'Phone Sign-in'),
    }
  }

  _getCode = () => {
    this.setState({ spinner: true }, this.textInput.current.blur())
    const phoneNumber = this.state.textInputValue
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
            console.log('code sent')
            // on ios this is the final phone auth state event you'd receive
            // so you'd then ask for user input of the code and build a credential from it
            // as demonstrated in the `signInWithPhoneNumber` example above
            this.setState({
              confirmResult: phoneAuthSnapshot,
              spinner: false,
              enterCode: true,
            },
              this.textInput.current.focus())
            break
          case firebase.auth.PhoneAuthState.ERROR: // or 'error'
            console.log('verification error')
            console.log(phoneAuthSnapshot.error)
            if (phoneAuthSnapshot.error) {
              this._showSnackBar(phoneAuthSnapshot.error.message, {
                label: 'Ok',
                onPress: () => {
                  this.setState({ spinner: false })
                  if (this) {
                    this.textInput.current.focus()
                  }
                },
              })
            }
            break

          // ---------------------
          // ANDROID ONLY EVENTS
          // ---------------------
          case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
            console.log('auto verify on android timed out')
            // proceed with your manual code input flow, same as you would do in
            // CODE_SENT if you were on IOS
            if (!this.unmount) {
              this.setState({
                confirmResult: phoneAuthSnapshot,
                spinner: false,
                enterCode: true,
              },
                this.textInput.current.focus())
            }
            break
          case firebase.auth.PhoneAuthState.AUTO_VERIFIED:
            // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
            const { verificationId, code } = phoneAuthSnapshot
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code ? code : undefined)
            this._signInOrLinkAccount(credential)
            break

          default:
            break
        }
      })
  }

  _signInOrLinkAccount = (credential: AuthCredential) => {
    const onSignInSuccess = this.props.navigation.getParam('onSignInSuccess', false)
    const linkAccounts = this.props.navigation.getParam('linkAccounts', false)
    const { currentUser } = firebase.auth()
    if (currentUser && linkAccounts) {
      currentUser.linkWithCredential(credential)
        .then(() => {
          if (onSignInSuccess) {
            onSignInSuccess(credential)
          }
        })
        .catch(error => this._showCodeError(error))
    } else {
      firebase.auth().signInWithCredential(credential)
        .then(() => {
          if (onSignInSuccess) {
            onSignInSuccess(credential)
          }
        })
        .catch(error => this._showCodeError(error))
    }
  }

  _showCodeError = (error: any) => {
    this._showSnackBar(error.message, {
      label: 'Ok',
      onPress: () => {
        this.setState({ spinner: false })
        if (this) {
          this.textInput.current.focus()
        }
      },
    })
  }

  _showSnackBar = (snackBarMessage: string, snackBarAction?: object | any) => {
    this.setState({ snackBarMessage, snackBarAction, snackBarVisible: true })
  }

  _verifyCode = async () => {
    this.setState({ spinner: true }, this.textInput.current.blur())
    try {
      const { confirmResult } = this.state
      const code = this.state.textInputValue
      if (confirmResult) {
        const credential = await firebase.auth.PhoneAuthProvider.credential(confirmResult.verificationId, code)
        this._signInOrLinkAccount(credential)
      } else {
        this.setState({ spinner: false })
      }
    } catch (err) {
      this._showSnackBar(err.message)
    }
  }

  _onChangeText = (val: string) => {
    this.setState({ textInputValue: val })
    if (!this.state.enterCode) { return }
    if (val.length === MAX_LENGTH_CODE) {
      this._verifyCode()
    }
  }

  _tryAgain = () => {
    this.textInput.current.setNativeProps({ text: '' })
    this.textInput.current.focus()
    this.setState({ enterCode: false, spinner: false })
  }

  _getSubmitAction = () => {
    this.state.enterCode ? this._verifyCode() : this._getCode()
  }

  _changeCountry = (country: any) => {
    this.setState({ country })
    this.textInput.current.focus()
  }

  _renderFooter = () => {

    if (this.state.enterCode) {
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      )
    }

    return (
      <View>
        <Text style={styles.disclaimerText}>
          {/*tslint:disable-next-line:max-line-length*/}
          By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.
        </Text>
      </View>
    )

  }

  _renderCountryPicker = () => {

    if (this.state.enterCode) {
      return (
        <View />
      )
    }

    return (
      <CountryPicker
        closeable={true}
        showCallingCode={true}
        styles={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        translation="common"
      />
    )

  }

  _renderCallingCode = () => {
    if (this.state.enterCode) {
      return (
        <View />
      )
    }
    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    )

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
    const headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
    const buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code'
    const textStyle = this.state.enterCode ? {
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier',
    } : {}

    return (

      <View style={styles.container}>

        <Text style={styles.header}>{headerText}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
            {/** fix 60 px to stop button/children moving around */}
            <View style={{ minHeight: 50 }} />

            {this._renderCountryPicker()}
            {this._renderCallingCode()}
            <TextInput
              ref={this.textInput}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={this._onChangeText}
              placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={Object.assign({}, styles.textInput, textStyle)}
              returnKeyType="go"
              autoFocus={true}
              placeholderTextColor={brandColor}
              selectionColor={brandColor}
              maxLength={this.state.enterCode ? 6 : 20}
              onSubmitEditing={this._getSubmitAction}
              blurOnSubmit={true}
            />
          </View>
          <Button
            mode="contained"
            disabled={this.state.spinner}
            style={{ marginTop: 20, }}
            icon={() => <MaterialIcons name="add-a-photo" color="#744BAC" />}
            loading={this.state.spinner}
            onPress={this._getSubmitAction}
            color="#744BAC"
          >
            {buttonText}
          </Button>
          {this._renderFooter()}
        {this._renderSnackBar()}
      </View>
    )
  }
}

const MAX_LENGTH_CODE = 6

// if you want to customize the country picker
const countryPickerCustomStyles = {}

// your brand's theme primary color
const brandColor = '#744BAC'

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor,
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
    fontWeight: 'bold',
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  disclaimerText: {
    marginTop: 10,
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10,
  },
})
