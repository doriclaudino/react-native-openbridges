import * as React from 'react'
import { View, Slider } from 'react-native'
import { Text, Appbar } from 'react-native-paper'

interface Props {
  onCancelClick: () => void
  onValueChange: (text: number) => void
  value: number
  showTitle: boolean
  suffix: string
  minimumValue: number
  maximumValue: number
  step: number
  disabled: boolean
}

export default class extends React.Component<Props> {
  render() {
    const {
      onCancelClick,
      value = 5,
      showTitle = true,
      suffix, minimumValue = 1,
      maximumValue = 30,
      step = 1,
      disabled = false,
      ...rest
    } = this.props
    return (
      <Appbar.Header>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
          {showTitle && <Text style={{ color: 'white' }}>{value} {suffix}</Text>}
          <Slider
            disabled={disabled}
            style={{
              width: '80%',
              backgroundColor: '#6200ee',
            }}
            thumbTintColor="white"
            minimumTrackTintColor="white"
            {...rest}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
          />
        </View>
        <Appbar.Action icon="cancel" onPress={onCancelClick} />
      </Appbar.Header>
    )
  }
}
