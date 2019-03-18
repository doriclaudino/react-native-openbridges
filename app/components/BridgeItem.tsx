import * as React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { Text, TouchableRipple, Divider, List, Colors } from 'react-native-paper'
import { capitalizeSentence } from '../helpers'
import BridgeStatus from './BridgeStatus'
import { Bridge } from 'store/bridge'

interface Props {
  onPress: () => any;
  bridge: Bridge
}

export default class extends React.Component<Props> {
  render() {
    const { bridge, onPress } = this.props
    return (
      <View>
        <TouchableRipple onPress={onPress} style={{ padding: 4 }}>
          <View style={styles.container}>
            <Image style={styles.image} source={{ uri: bridge.src }} />
            <View style={styles.innerContainer}>
              <Text numberOfLines={1} style={styles.title}>{capitalizeSentence(bridge.name)}</Text>
              <View style={styles.distanceContainer}>
                <Text numberOfLines={1} style={styles.text}>
                  {bridge.distance && bridge.distance.toFixed(2)}
                  <Entypo name="direction" size={10} color="gray" />
                </Text>
              </View>
              <BridgeStatus bridge={bridge} />
            </View>
            <List.Icon icon="keyboard-arrow-right" color={Colors.black} />
          </View>
        </TouchableRipple>
        <Divider />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 60,
    overflow: 'hidden',
    borderRadius: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    flexWrap: 'wrap',
  },
  text: {
    flex: 1,
    fontSize: 10,
    color: 'gray',
    flexWrap: 'wrap',
  },
  distanceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 2,
    paddingHorizontal: 4,
  },
})
