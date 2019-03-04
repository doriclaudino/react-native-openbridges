import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';

export default class LoadingScreen extends React.Component {
    _signInSuccess = () => {
        this.props.navigation.navigate('App')
    }

    componentDidMount() {
        linkAccounts = this.props.navigation.getParam('linkAccounts', false)
        if (firebase.auth().currentUser && !linkAccounts)
            this.props.navigation.navigate('App')
        else {
            if (linkAccounts)
                this.props.navigation.navigate('LinkAccount', { title: 'Link Accounts', linkAccounts })
            else
                this.props.navigation.navigate('SignInOptions', { title: 'Credentials', linkAccounts })
        }
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