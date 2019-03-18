import * as React from 'react'
import { View, TextInputProps, StyleSheet } from 'react-native'
import { Appbar } from 'react-native-paper'
import Searchbar from './SearchBar'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

interface Props extends TextInputProps {
  onIconPress: () => void
}

export default class extends React.Component<Props> {
  render() {
    return (
      <Appbar.Header>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Searchbar
            icon={() => <MaterialIcons name="keyboard-backspace" size={24} color="white" />}
            placeholder="search"
            style={styles.default}
            placeholderTextColor="#812cf9"
            selectionColor="white"
            textColor="white"
            rightIcon={() => <MaterialIcons name="close" size={24} color="white" />}
            {...this.props}
          />
        </View>
      </Appbar.Header>
    )
  }
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: '#6200ee',
    borderBottomWidth: 1,
    borderBottomColor: '#812cf9',
    elevation: 0,
    color: 'white',
  },
})
