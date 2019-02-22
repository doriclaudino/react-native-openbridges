import * as React from 'react';
import { View } from 'react-native';
import {
    Appbar,
} from 'react-native-paper';
import Searchbar from './SearchBar'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class extends React.Component {
    render() {
        return (
            <Appbar.Header>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Searchbar
                        icon={() => <MaterialIcons name="keyboard-backspace" size={24} color="white" />}
                        placeholder="search"
                        style={{ backgroundColor: '#6200ee', borderBottomWidth: 1, borderBottomColor: '#812cf9', elevation: 0, color: 'white' }}
                        placeholderTextColor="#812cf9"
                        selectionColor="white"
                        textColor='white'
                        rightIcon={() => <MaterialIcons name="close" size={24} color="white" />}
                        {...this.props}
                    />
                </View>
            </Appbar.Header>
        )
    }
}