import * as React from 'react'
import { ScrollView, View, Slider, BackHandler, } from 'react-native'
import {
  Text,
  Button,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper'

interface Props {
  defaultValue: number
  visible: boolean
  onClose: () => void
  onConfirm: (value: number) => void
}

interface State {
  currentValue: number,
  defaultValue: number,
}

export default class extends React.Component<Props, State> {
  state = {
    currentValue: this.props.defaultValue,
    defaultValue: this.props.defaultValue,
  }

  _onValueChange = (value: number) => this.setState({ currentValue: value })

  _setDefaultValue = () => this.setState({ currentValue: this.state.defaultValue })

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton)
  }

  _handleBackButton = () => {
    this.props.onClose()
    return true //act as stopPropagation
  }

  render() {
    const { visible, onClose, onConfirm } = this.props
    const { currentValue } = this.state
    return (
      <Portal>
        <Dialog dismissable={false} visible={visible}>
          <Dialog.Title>Bridge Status Threshold</Dialog.Title>
          <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
            <ScrollView>
              <View>
                <Dialog.Content>
                  <Paragraph style={{ paddingBottom: 30 }}>
                    Automatically changes bridge status
                    <Text style={{ fontWeight: 'bold', }}>
                      {currentValue}  min
                    </Text>
                    before event occurs
                  </Paragraph>
                  <Slider
                    value={currentValue}
                    minimumValue={5}
                    maximumValue={120}
                    step={5}
                    onValueChange={this._onValueChange}
                  />
                </Dialog.Content>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                onPress={() => {
                  this._setDefaultValue()
                  onClose()
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  onConfirm(currentValue)
                }}
              >
                save({currentValue})
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }
}
