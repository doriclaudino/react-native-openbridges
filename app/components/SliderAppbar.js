import * as React from 'react';
import { View, Slider } from 'react-native';
import {
    Text,
    Appbar,
} from 'react-native-paper';

export default class extends React.Component {
    render() {
        const { disabled, onValueChange, onCancelClick, value, showTitle, suffix } = this.props
        return (
            <Appbar.Header>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    {showTitle && <Text style={{ color: 'white' }}>{value} {suffix}</Text>}
                    <Slider disabled style={{ width: '80%', backgroundColor: '#6200ee', color: 'white' }} thumbTintColor="white" minimumTrackTintColor="white" minimumValue={1} maximumValue={30} step={1} {...this.props} />
                </View>
                <Appbar.Action icon="cancel" onPress={onCancelClick} />
            </Appbar.Header>
        )
    }
}