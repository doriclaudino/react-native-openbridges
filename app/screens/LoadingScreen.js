import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';

export default class LoadingScreen extends React.Component {
    _signInSuccess = () => {
        this.props.navigation.navigate('App')
    }

    componentDidMount() {
        if (firebase.auth().currentUser)
            this.props.navigation.navigate('App')
        else
            this.props.navigation.navigate('SignInOptions', { title: 'Sign-In', onSignInSuccess: this._signInSuccess })
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})