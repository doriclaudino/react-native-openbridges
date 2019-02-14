import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native'

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        return ({
            headerLeft: () => (<Button title="menu" onPress={() => navigation.openDrawer()}></Button>),
            title: navigation.getParam('title', 'default'),
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