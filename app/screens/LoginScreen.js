import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native'
import { Appbar } from 'react-native-paper';
import firebase from 'react-native-firebase';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        return ({
            header: (
                <Appbar.Header>
                    <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
                    <Appbar.Content title={navigation.getParam('title', 'default')} />
                </Appbar.Header>
            )
        })
    };

    tryLogIn = () => {
        console.log('trying login')
        firebase.auth()
            .signInAnonymously()
            .then(credential => {
                if (credential) {
                    console.log('default app user ->', credential.user.toJSON());
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Login</Text>
                <Button title="LOG-IN" onPress={this.tryLogIn}></Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})