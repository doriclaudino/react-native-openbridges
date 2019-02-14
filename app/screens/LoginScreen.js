import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native'
import { Appbar } from 'react-native-paper';

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

    render() {
        return (
            <View style={styles.container}>
                <Text>Login</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})