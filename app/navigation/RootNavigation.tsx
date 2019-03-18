import React from 'react'
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator } from 'react-navigation'
import BridgeListScreen from '../screens/BridgeListScreen'
import BridgeDetailScreen from '../screens/BridgeDetailScreen'
import PhoneScreen from '../screens/PhoneScreen'
import CustomDrawerRender from '../components/DrawerWithLogoutButton'
import LoadingScreen from '../screens/LoadingScreen'
import LinkAccountScreen from '../screens/LinkAccountScreen'

const BridgeStack = createStackNavigator({
  List: {
    screen: BridgeListScreen,
    params: {
      title: 'Bridges',
    },
  },
  Detail: {
    screen: BridgeDetailScreen,
  },
  LinkAccount: {
    screen: LinkAccountScreen,
  },
  LinkPhoneAccount: {
    screen: PhoneScreen,
  },
},
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#6200ee',
      },
      headerTintColor: '#fff',
    },
  })

const DrawerNavigation = createDrawerNavigator({
  Bridges: BridgeStack,
},
  {
    initialRouteName: 'Bridges',
    contentComponent: (props) => <CustomDrawerRender {...props} />,
  })

const AuthStack = createStackNavigator({
  SignInOptions: {
    screen: LinkAccountScreen,
  },
  PhoneSignIn: {
    screen: PhoneScreen,
  },
},
  {
    initialRouteName: 'SignInOptions',
    defaultNavigationOptions: {
      title: 'Sign-In',
      headerStyle: {
        backgroundColor: '#6200ee',
      },
      headerTintColor: '#fff',
    },
  })

const switchNav = createSwitchNavigator(
  {
    App: DrawerNavigation,
    Auth: AuthStack,
    Loading: LoadingScreen,
  },
  {
    initialRouteName: 'Loading',
  }
)

export default createAppContainer(switchNav)
