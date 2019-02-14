import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native'

export default class BridgeListScreen extends Component {
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
        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>
                <Text onPress={() => navigate('Detail', { BridgeName: 'chelsea street bridge' })}>OPEN DETAIL</Text>
                <Text onPress={() => navigate('Detail', { BridgeName: 'cambridge street bridge' })}>OPEN DETAIL</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})