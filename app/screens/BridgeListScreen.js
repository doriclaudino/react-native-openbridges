import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button
} from 'react-native'
import { Appbar } from 'react-native-paper';

export default class BridgeListScreen extends Component {
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
        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>
                <Text onPress={() => navigate('Detail', { BridgeName: 'chelsea street bridge' })}>OPEN DETAIL 1</Text>
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