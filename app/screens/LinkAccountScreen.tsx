import React from 'react'
import { View } from 'react-native'
import { Button, Snackbar } from 'react-native-paper'
import firebase, { RNFirebase } from 'react-native-firebase'
import FacebookLogin from '../components/FacebookLogin'
import { NavigationParams, NavigationScreenProps } from 'react-navigation'

interface State {
  providers: string[],
  disableUnlink: boolean,
  snackBarMessage?: string
  snackBarAction?: object | any
  snackBarVisible: boolean
}

export default class LinkAccountScreen extends React.Component<NavigationScreenProps, State> {
  constructor(props: NavigationScreenProps) {
    super(props)
    this.state = {
      providers: [],
      disableUnlink: false,
      snackBarVisible: false,
      snackBarMessage: '',
    }
    Snackbar.DURATION_SHORT = 2000
  }
  unsubscribe: RNFirebase.auth.AuthListenerCallback | undefined

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe(firebase.auth().currentUser)
    }
  }

  componentWillMount() {
    this.unsubscribe = firebase.auth().onUserChanged((user) => {
      const { currentUser } = firebase.auth()
      if (user && currentUser) {
        this.setState({
          disableUnlink: currentUser.providerData.length === 1,
          providers: currentUser.providerData.map(provider => provider.providerId),
        })
      }
    })
  }

  static navigationOptions = ({ navigation }: NavigationParams) => ({
    title: `${navigation.state.params.title}`,
  })

  existProvider(name: string) {
    return this.state.providers.indexOf(name) > -1
  }

  _onPhoneLinkSuccess = () => {
    this.props.navigation.navigate('Loading', { linkAccounts: true })
  }

  _renderPhone = (linkAccounts: boolean, onSignInSuccess: () => void) => {
    const provider = 'phone'
    return (
      <View>
        {
          this.existProvider(provider) &&
          <Button
            disabled={this.state.disableUnlink}
            icon="phone"
            mode="contained"
            onPress={() => this._unlinkProvider('phone')}
            style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
          >
            UNLINK PHONE
          </Button>
        }
        {
          firebase.auth().currentUser && !this.existProvider(provider) &&
          <Button
            icon="phone"
            mode="contained"
            style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
            onPress={() => this.props.navigation.navigate('LinkPhoneAccount',
              {
                linkAccounts, title: 'Link you phone',
                onSignInSuccess: this._onPhoneLinkSuccess,
              })}
          >
            LINK PHONE
          </Button>
        }
        {
          !firebase.auth().currentUser &&
          <Button
            icon="phone"
            mode="contained"
            style={{ width: 190, backgroundColor: 'gray', marginBottom: 10, }}
            onPress={() => this.props.navigation.navigate('PhoneSignIn',
              {
                onSignInSuccess,
                title: 'Sign-in with your phone',
              })
            }
          >
            WITH PHONE
          </Button>
        }
      </View>
    )
  }

  _renderFacebook = (linkAccounts: boolean, onSignInSuccess: () => void) => {
    const provider = 'facebook.com'
    return (
      <View>
        {
          this.existProvider(provider) &&
          <FacebookLogin
            onPress={() => this._unlinkProvider(provider)}
            disabled={this.state.disableUnlink}
          >
            UNLINK FACEBOOK
          </FacebookLogin>
        }
        {
          firebase.auth().currentUser && !this.existProvider(provider) &&
          <FacebookLogin
            onSuccess={() => this._showSnackBar(`Account linked`)}
            onError={err => this._showSnackBar(err.message)}
            linkAccounts={linkAccounts}
          >
            LINK FACEBOOK
          </FacebookLogin>
        }
        {
          !firebase.auth().currentUser &&
          <FacebookLogin
            onSuccess={(ok) => {
              console.log('signed, credential: ', ok)
              if (onSignInSuccess) {
                onSignInSuccess()
              }
            }}
            onError={err => this._showSnackBar(err.message)}
          >
            WITH FACEBOOK
          </FacebookLogin>
        }
      </View>
    )
  }

  _unlinkProvider = async (provider: string) => {
    if (this.state.disableUnlink) {
      this._showSnackBar(`Can't unlink your last provider.`)
    } else {
      const { currentUser } = firebase.auth()
      if (currentUser) {
        currentUser.unlink(provider)
          .then((user) => {
            this._showSnackBar(`Account unlinked`)
          })
          .catch((reason) => {
            this._showSnackBar(`Can't unlinked account`)
          })
      }
    }
  }

  _showSnackBar = (snackBarMessage: string, snackBarAction?: any) => {
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
    const onSignInSuccess = this.props.navigation.getParam('onSignInSuccess')
    const linkAccounts = this.props.navigation.getParam('linkAccounts')
    console.log(this.props.navigation.state.params)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this._renderPhone(linkAccounts, onSignInSuccess)}
        {this._renderFacebook(linkAccounts, onSignInSuccess)}
        {this._renderSnackBar()}
      </View>
    )
  }
}
