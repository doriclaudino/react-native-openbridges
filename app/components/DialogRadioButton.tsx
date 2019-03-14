import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
    Subheading,
    Button,
    Portal,
    Dialog,
    RadioButton,
    TouchableRipple,
} from 'react-native-paper';
import { TBridgeStatus } from 'store/bridge';

interface Props {
    checked: TBridgeStatus
    visible: boolean
    onClose: () => void
    onConfirm: (checked: TBridgeStatus) => void
}

interface State {
    checked: TBridgeStatus
}

export default class extends React.Component<Props, State> {
    state: State = {
        checked: this.props.checked
    };

    render() {
        const { checked } = this.state;
        const { visible, onClose, onConfirm } = this.props;
        return (
            <Portal>
                <Dialog onDismiss={onClose} visible={visible}>
                    <Dialog.Title>Choose an option</Dialog.Title>
                    <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
                        <ScrollView>
                            <View>
                                <TouchableRipple
                                    onPress={() => this.setState({ checked: 'Open' })}
                                >
                                    <View style={styles.row}>
                                        <View pointerEvents="none">
                                            <RadioButton
                                                value={'Open'}
                                                status={checked === 'Open' ? 'checked' : 'unchecked'}
                                            />
                                        </View>
                                        <Subheading style={styles.text}>Open</Subheading>
                                    </View>
                                </TouchableRipple>
                                <TouchableRipple
                                    onPress={() => this.setState({ checked: 'Close' })}
                                >
                                    <View style={styles.row}>
                                        <View pointerEvents="none">
                                            <RadioButton
                                                value={'Close'}
                                                status={checked === 'Close' ? 'checked' : 'unchecked'}
                                            />
                                        </View>
                                        <Subheading style={styles.text}>Close</Subheading>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            onConfirm(checked);
                        }}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        paddingLeft: 8,
    },
});
