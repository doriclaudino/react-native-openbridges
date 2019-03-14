import * as React from 'react';
import { View, Slider } from 'react-native';
import {
    Text,
    Appbar,
} from 'react-native-paper';

interface Props {
    onCancelClick: () => void
    value: number
    showTitle: boolean
    suffix: string
    minimumValue: number
    maximumValue: number
    step: number
}

export default class extends React.Component<Props> {
    render() {
        const { onCancelClick, value, showTitle, suffix, minimumValue = 1, maximumValue = 30, step = 1 } = this.props
        return (
            <Appbar.Header>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    {showTitle && <Text style={{ color: 'white' }}>{value} {suffix}</Text>}
                    <Slider disabled style={{ width: '80%', backgroundColor: '#6200ee', color: 'white' }} thumbTintColor="white" minimumTrackTintColor="white"  {...this.props} minimumValue={minimumValue} maximumValue={maximumValue} step={step} />
                </View>
                <Appbar.Action icon="cancel" onPress={onCancelClick} />
            </Appbar.Header>
        )
    }
}