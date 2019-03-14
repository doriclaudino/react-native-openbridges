import * as React from 'react';
import { View, Image } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { Text, TouchableRipple, Divider, List } from 'react-native-paper';
import { capitalizeSentence } from '../helpers';
import BridgeStatus from './BridgeStatus';

export default class extends React.Component {
    render() {
        console.log(this.props)
        const { bridge, onPress } = this.props
        return (
            <View>
                <TouchableRipple onPress={onPress} style={{ padding: 4 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Image style={{ width: 100, height: 60, overflow: 'hidden', borderRadius: 10 }} source={{ uri: bridge.src }} />
                        <View style={{ flex: 1, flexDirection: 'column', flexGrow: 2, paddingHorizontal: 4 }}>
                            <Text numberOfLines={1} style={{ flex: 1, fontSize: 16, color: 'black', flexWrap: "wrap" }}>{capitalizeSentence(bridge.name)}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Text numberOfLines={1} style={{ flex: 1, fontSize: 10, color: 'gray', flexWrap: "wrap" }}>
                                    {bridge.distance.toFixed(2)}
                                    <Entypo name="direction" size={10} color="gray" />
                                </Text>
                            </View>
                            <BridgeStatus bridge />
                        </View>
                        <List.Icon icon="keyboard-arrow-right" />
                    </View>
                </TouchableRipple>
                <Divider />
            </View>
        )
    }
}