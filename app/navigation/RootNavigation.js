import React, { Component } from 'react'
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator } from "react-navigation";
import BridgeListScreen from '../screens/BridgeListScreen';
import BridgeDetailScreen from '../screens/BridgeDetailScreen';
import PhoneScreen from '../screens/PhoneScreen';
import SignInScreen from '../screens/SignInScreen';
import CustomDrawerRender from '../components/DrawerWithLogoutButton'
import LoadingScreen from '../screens/LoadingScreen';

const PhoneAuthStack = createStackNavigator({
    PhoneScreen: {
        screen: PhoneScreen,
        params: {
            title: 'PhoneScreen',
        }
    },
});

const BridgeStack = createStackNavigator({
    List: {
        screen: BridgeListScreen,
        params: {
            title: 'Bridges',
        }
    },
    Detail: {
        screen: BridgeDetailScreen,
    }
});

const DrawerNavigation = createDrawerNavigator({
    Bridges: BridgeStack,
},
    {
        initialRouteName: 'Bridges',
        contentComponent: (props) => <CustomDrawerRender {...props} />
    });

const AuthStack = createStackNavigator({
    SignInOptions: {
        screen: SignInScreen,
    },
    PhoneSignIn: {
        screen: PhoneScreen,
    }
},
    {
        initialRouteName: 'SignInOptions',
        defaultNavigationOptions: {
            title: 'Sign-In',
            headerStyle: {
                backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
        }
    });

const switchNav = createSwitchNavigator(
    {
        App: DrawerNavigation,
        Auth: AuthStack,
        Loading: LoadingScreen
    },
    {
        initialRouteName: 'Loading',
    }
);

export default createAppContainer(switchNav);