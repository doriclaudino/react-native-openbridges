import * as React from 'react';
import { ScrollView, View, Slider } from 'react-native';
import {
    Text,
    Button,
    Portal,
    Dialog,
    Paragraph,
} from 'react-native-paper';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: this.props.defaultValue,
            defaultValue: this.props.defaultValue,
        }
    }

    _onValueChange = (value) => this.setState({ currentValue: value })


    _setDefaultValue = () => this.setState({ currentValue: this.state.defaultValue })

    render() {
        const { visible, onClose, onConfirm } = this.props;
        const { currentValue } = this.state;
        return (
            <Portal>
                <Dialog onDismiss={() => { this._setDefaultValue(); onClose(); }} visible={visible}>
                    <Dialog.Title>Bridge Status Threshold</Dialog.Title>
                    <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
                        <ScrollView>
                            <View>
                                <Dialog.Content>
                                    <Paragraph style={{ paddingBottom: 30 }}>
                                        Automatically changes bridge status <Text style={{ fontWeight: 'bold', }}>{currentValue}  min</Text> before event occurs</Paragraph>
                                    <Slider value={currentValue} minimumValue={5} maximumValue={120} step={5} onValueChange={this._onValueChange} />
                                </Dialog.Content>
                            </View>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            this._setDefaultValue();
                        }}>Reset</Button>
                        <Button onPress={() => {
                            onConfirm(currentValue);
                        }}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}