import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'

export default class BridgeDetailScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.navigation.state.params.BridgeName}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})