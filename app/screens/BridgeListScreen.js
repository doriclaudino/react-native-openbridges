import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'

export default class BridgeListScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>
                <Text onPress={() => navigate('BridgeDetail', { BridgeName: 'chelsea street bridge' })}>OPEN DETAIL</Text>
                <Text onPress={() => navigate('BridgeDetail', { BridgeName: 'cambridge street bridge' })}>OPEN DETAIL</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})