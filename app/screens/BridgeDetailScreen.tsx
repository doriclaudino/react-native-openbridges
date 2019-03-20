import React from 'react'
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native'
import { Button, Card, Title, List, Divider, TouchableRipple, Appbar } from 'react-native-paper'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Moment from 'react-moment'
import DialogSlider from '../components/DialogSlider'
import DialogRadioButton from '../components/DialogRadioButton'
import { capitalizeSentence } from '../helpers'
import { addBridgeEvent, delBridgeEvent, addBridgeStatusThreshold } from '../actions'
import { connect } from 'react-redux'
import BridgeStatus from '../components/BridgeStatus'
import { NavigationScreenProps, NavigationParams } from 'react-navigation'
import { Bridge, TBridgeStatus, IEvent, IStatus } from 'store/bridge'

interface Props extends NavigationScreenProps {
  bridge: Bridge,
  addBridgeEvent: (bridge: Bridge, event: IStatus) => void
  delBridgeEvent: (bridge: Bridge, event: IEvent) => void
  addBridgeStatusThreshold: (bridge: Bridge, statusThreshold: number) => void
}

interface State {
  isDateTimePickerVisible: boolean,
  isDialogRadioButtonVisible: boolean,
  isDialogSliderVisible: boolean,
  selectedStatus?: TBridgeStatus,
  selectedDateTime?: Date,
  bridges: Bridge[]
}

// Upper case all rendered dates.
Moment.globalFilter = (toStringMoment: string) => {
  return toStringMoment.toUpperCase()
}

const mapStateToProps = (state: State, props: Props) => {
  const { params } = props.navigation.state
  console.log({ params })
  if (params && params.bridge) {
    console.log(params.bridge)
    const bridge = state.bridges.find(bridge => bridge.id === params.bridge.id)
    return { bridge }
  }
}

const mapDispatchToProps = { addBridgeEvent, delBridgeEvent, addBridgeStatusThreshold }

class BridgeDetailScreen extends React.Component<Props, State> {
  state: State = {
    isDateTimePickerVisible: false,
    isDialogRadioButtonVisible: false,
    isDialogSliderVisible: false,
    bridges: [],
  }

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavigationParams>) => {
    const bridge: Bridge = navigation.getParam('bridge')
    return {
      header: (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={capitalizeSentence(bridge.name)} />
          <Appbar.Action
            icon="settings"
            disabled={!navigation.state.params!.onDialogSliderClick}
            onPress={() => { navigation.state.params!.onDialogSliderClick() }}
          />
        </Appbar.Header>
      ),
    }
  }

  componentWillMount() {
    //** need fix setState delay with disabled={!navigation.state.params.onDialogSliderClick}*/
    this.props.navigation.setParams({
      onDialogSliderClick: this._flagDialogSlider,
    })
  }

  _renderDialogSlider = (bridge: Bridge) => {
    return (
      <DialogSlider
        visible={true}
        onClose={this._flagDialogSlider}
        onConfirm={this._handleDialogSlider}
        defaultValue={bridge.statusThreshold}
      />
    )
  }

  _renderDialogRadioButton = () => {
    return (
      <DialogRadioButton
        visible={true}
        onClose={this._flagDialogRadioButton}
        onConfirm={this._handleDialogRadioButton}
        checked={'Close'}
      />
    )
  }
  _renderDateTimePicker = () => {
    return (
      <DateTimePicker
        date={new Date()}
        mode="datetime"
        isVisible={true}
        onConfirm={this._handleDateTimePicker}
        onCancel={this._flagDateTimePicker}
      />
    )
  }

  render() {
    const { bridge } = this.props
    const { events = [] } = bridge
    return (
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.content}
      >
        {this.state.isDialogSliderVisible && this._renderDialogSlider(bridge)}
        {this.state.isDialogRadioButtonVisible && this._renderDialogRadioButton()}
        {this.state.isDateTimePickerVisible && this._renderDateTimePicker()}

        <Card style={styles.card}>
          <Card.Cover source={{ uri: bridge.src }} />
          <BridgeStatus bridge={bridge} />
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Events</Title>
            <Card.Actions>
              <Button onPress={() => { this._flagDialogRadioButton() }}>Add</Button>
            </Card.Actions>
            <FlatList
              style={styles.container}
              data={events}
              keyExtractor={(item, index) => `${index}`}
              extraData={events}
              renderItem={({ item }) => <View><Divider />
                <List.Item
                  title={item.status}
                  description={(<Moment element={Text} format={'llll'}>{+item.when}</Moment>)}
                  left={() => (
                    <TouchableRipple>
                      <List.Icon
                        color="gray"
                        icon="schedule"
                      />
                    </TouchableRipple >
                  )}
                  right={item.when ? () => {
                    return (
                      <TouchableRipple
                        onPress={() => {
                          this._handleDeleteEvent(bridge, item)
                        }}
                      >
                        <List.Icon
                          color="gray"
                          icon="delete"
                        />
                      </TouchableRipple>
                    )
                  } : undefined}
                /></View>}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    )
  }

  /** flags */
  _flagDateTimePicker = () => this.setState({ isDateTimePickerVisible: !this.state.isDateTimePickerVisible })
  _flagDialogSlider = () => this.setState({ isDialogSliderVisible: !this.state.isDialogSliderVisible })
  _flagDialogRadioButton = () => this.setState({ isDialogRadioButtonVisible: !this.state.isDialogRadioButtonVisible })

  _handleDialogRadioButton = (selected: TBridgeStatus) => {
    this.setState({ selectedStatus: selected })
    this._flagDialogRadioButton()
    this._flagDateTimePicker()
  }

  _handleDateTimePicker = (date: Date) => {
    this.setState({ selectedDateTime: date })
    this._flagDateTimePicker()
    if (this.state.selectedStatus) {
      const event: IStatus = {
        status: this.state.selectedStatus,
        when: date,
      }
      this.props.addBridgeEvent(this.props.bridge, event)
    }
  }

  _handleDialogSlider = (newThreshold: number) => {
    console.log(this.props.bridge)
    this.props.addBridgeStatusThreshold(this.props.bridge, newThreshold)
    this._flagDialogSlider()
  }

  _handleDeleteEvent = (bridge: Bridge, event: IEvent) => {
    this.props.delBridgeEvent(bridge, event)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BridgeDetailScreen as any)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  card: {
    marginBottom: 4,
  },
})
