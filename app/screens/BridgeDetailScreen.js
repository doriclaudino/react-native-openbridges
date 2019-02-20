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
import moment from 'moment'
import Moment from 'react-moment';
import DialogSlider from '../components/DialogSlider';
import DialogRadioButton from '../components/DialogRadioButton';
import { capitalize } from '../helpers'
import { delBridgeEvent } from '../actions'
import { connect } from 'react-redux';


// Upper case all rendered dates.
Moment.globalFilter = (d) => {
    return d.toUpperCase();
};

const mapStateToProps = (state) => {
    return { bridge: state.bridges }
}

const mapDispatchToProps = { delBridgeEvent }

class BridgeDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: new Date(),
            isDateTimePickerVisible: false,
            isModalVisible: false,
            selectedStatus: null,
            selectedDateTime: null,
            isSliderModalVisible: false,
        };
    }


    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title={capitalize(navigation.state.params.bridge.name)} />
                    <Appbar.Action icon="settings" onPress={() => { navigation.state.params.onConfigClick() }} />
                </Appbar.Header>
            )
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({
            onConfigClick: this._showSliderModal
        });
    }

    render() {
        const { bridge } = this.props.navigation.state.params
        const { events } = bridge
        return (
            <ScrollView
                style={[styles.container]}
                contentContainerStyle={styles.content}
            >
                <DialogSlider
                    visible={this.state.isSliderModalVisible}
                    onClose={this._hideSliderModal}
                    onConfirm={this._handleSliderModal}
                    defaultValue={bridge.statusThreshold}
                />

                <DialogRadioButton
                    visible={this.state.isModalVisible}
                    onClose={this._hideOptionModal}
                    onConfirm={this._handleOptionModal}
                    checked='Close' />

                <DateTimePicker
                    date={this.state.currentDate}
                    mode='datetime'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <Card style={styles.card}>
                    <Card.Cover source={{ uri: bridge.src }} />
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Events</Title>
                        <Card.Actions>
                            <Button onPress={() => { this._showOptionModal() }}>Add</Button>
                        </Card.Actions>
                        <FlatList
                            style={styles.container}
                            data={events}
                            keyExtractor={(item, index) => `${index}`}
                            extraData={events}
                            renderItem={({ item }) => <View><Divider />
                                <List.Item
                                    title={item.status}
                                    description={this._formatDate(item.when)}
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

    /** Modal and datepicker */
    _showDateTimePicker = () => this.setState({ currentDate: new Date(), isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _showOptionModal = () => this.setState({ isModalVisible: true });

    _hideOptionModal = () => this.setState({ isModalVisible: false });

    _handleOptionModal = (selected) => {
        this.setState({ selectedStatus: selected });
        this._hideOptionModal();
        this._showDateTimePicker();
    };

    _handleDatePicked = (date) => {
        this.setState({ selectedDateTime: date });
        this._hideDateTimePicker();

        //rootStore.bridgeStore.addEvent({ status: this.state.selectedStatus, when: date })
    };


    /** Slider modal for Threshold */
    _showSliderModal = () => this.setState({ isSliderModalVisible: true });

    _hideSliderModal = () => this.setState({ isSliderModalVisible: false });

    _handleSliderModal = (newThreshold) => {
        this._hideSliderModal()
    };

    _handleDeleteEvent = (bridge, event) => {
        this.props.delBridgeEvent({ bridge, event })
        //**** update here */
        delete bridge.events.filter(ev=> ev.id!==event.id)

        setTimeout(() => {
            const { length } = this.props.navigation.state.params.bridge.events
            console.log(length)
            this.forceUpdate()
        }, 5000);
    };

    _formatDate = (date) => {
        return new moment(date).format('llll');
    }
}


export default connect(null, mapDispatchToProps)(BridgeDetailScreen)

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