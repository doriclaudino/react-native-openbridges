import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList
} from 'react-native'
import { Button, Card, Title, List, Divider, TouchableRipple, Appbar } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'react-moment';
import DialogSlider from '../components/DialogSlider';
import DialogRadioButton from '../components/DialogRadioButton';
import { capitalize } from '../helpers'
import { addBridgeEvent, delBridgeEvent, addBridgeStatusThreshold } from '../actions'
import { connect } from 'react-redux';
import v3 from 'uuid'
import BridgeStatus from '../components/BridgeStatus';


// Upper case all rendered dates.
Moment.globalFilter = (d) => {
    return d.toUpperCase();
};

const mapStateToProps = (state, { navigation }) => {
    bridge = state.bridges.find(bridge => bridge.id === navigation.state.params.bridge.id)
    return { bridge }
}

const mapDispatchToProps = { addBridgeEvent, delBridgeEvent, addBridgeStatusThreshold }

class BridgeDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDateTimePickerVisible: false,
            isDialogRadioButtonVisible: false,
            isDialogSliderVisible: false,
            selectedStatus: null,
            selectedDateTime: null,
        };
    }


    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title={capitalize(navigation.state.params.bridge.name)} />
                    <Appbar.Action icon="settings" disabled={!navigation.state.params.onDialogSliderClick} onPress={() => { navigation.state.params.onDialogSliderClick() }} />
                </Appbar.Header>
            )
        }
    };

    componentWillMount() {
        //** need fix setState delay with disabled={!navigation.state.params.onDialogSliderClick}*/
        this.props.navigation.setParams({
            onDialogSliderClick: this._flagDialogSlider
        });
    }

    _renderDialogSlider = (bridge) => {
        return (<DialogSlider
            visible={true}
            onClose={this._flagDialogSlider}
            onConfirm={this._handleDialogSlider}
            defaultValue={bridge.statusThreshold}
        />)
    }

    _renderDialogRadioButton = () => {
        return (<DialogRadioButton
            visible={true}
            onClose={this._flagDialogRadioButton}
            onConfirm={this._handleDialogRadioButton}
            checked='Close' />)
    }
    _renderDateTimePicker = () => {
        return (<DateTimePicker
            date={new Date()}
            mode='datetime'
            isVisible={true}
            onConfirm={this._handleDateTimePicker}
            onCancel={this._flagDateTimePicker}
        />)
    }

    render() {
        const { bridge } = this.props
        const { events } = bridge
        return (
            <ScrollView
                style={[styles.container]}
                contentContainerStyle={styles.content}
            >
                {this.state.isDialogSliderVisible && this._renderDialogSlider(bridge)}
                {this.state.isDialogRadioButtonVisible && this._renderDialogRadioButton(bridge)}
                {this.state.isDateTimePickerVisible && this._renderDateTimePicker(bridge)}

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
                                    description={(<Moment element={Text} format={'llll'}>{item.when}</Moment>)}
                                    onPress={() => { }}
                                    left={() => (<TouchableRipple onPress={() => { }}><List.Icon icon="schedule" /></TouchableRipple >)}
                                    right={item.when ? () => (<TouchableRipple onPress={() => { this._handleDeleteEvent(bridge, item) }}><List.Icon icon="delete" /></TouchableRipple >) : null}
                                /></View>}
                        />
                    </Card.Content>
                </Card>
            </ScrollView>
        )
    }

    /** flags */
    _flagDateTimePicker = () => this.setState({ isDateTimePickerVisible: !this.state.isDateTimePickerVisible });
    _flagDialogSlider = () => this.setState({ isDialogSliderVisible: !this.state.isDialogSliderVisible });
    _flagDialogRadioButton = () => this.setState({ isDialogRadioButtonVisible: !this.state.isDialogRadioButtonVisible });

    _handleDialogRadioButton = (selected) => {
        this.setState({ selectedStatus: selected });
        this._flagDialogRadioButton();
        this._flagDateTimePicker();
    };

    _handleDateTimePicker = (date) => {
        this.setState({ selectedDateTime: date });
        this._flagDateTimePicker();
        this.props.addBridgeEvent({ bridge: this.props.bridge, event: { status: this.state.selectedStatus, when: date, id: v3() } })
    };

    _handleDialogSlider = (newThreshold) => {
        this.props.addBridgeStatusThreshold({ bridge: this.props.bridge, statusThreshold: newThreshold });
        this._flagDialogSlider()
    };

    _handleDeleteEvent = (bridge, event) => {
        this.props.delBridgeEvent({ bridge, event })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BridgeDetailScreen)

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
});