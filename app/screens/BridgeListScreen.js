/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button,
    FlatList,
    Image
} from 'react-native'
import { Appbar, Divider, List, TouchableRipple } from 'react-native-paper';
import { connect } from 'react-redux';
import { fetchbridges } from '../actions';

const mapStateToProps = (state) => {
    return { bridges: state.bridges }
}

const mapDispatchToProps = { fetchbridges }

const _capitalize = (string) => {
    return string.toLowerCase().split(' ').map((a) => a.charAt(0).toUpperCase() + a.substr(1)).join(' ')
}

class BridgeListScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.props.fetchbridges();
    }

    static navigationOptions = ({ navigation }) => {
        return ({
            header: (
                <Appbar.Header>
                    <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
                    <Appbar.Content title={navigation.getParam('title', 'default')} />
                </Appbar.Header>
            )
        })
    };

    _onItemListClick = (navigateTo, item) => {
        this.props.navigation.navigate(navigateTo, item);
    }


    render() {
        filteredBridges = this.props.bridges
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.container}
                    data={filteredBridges}
                    extraData={filteredBridges}
                    keyExtractor={(item, index) => `${item.id}`}
                    renderItem={({ item }) =>
                        <View>
                            <Divider />
                            <TouchableRipple onPress={() => this._onItemListClick('Detail', { bridge: item })} style={{ padding: 4 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Image style={{ width: 100, height: 60, overflow: 'hidden', borderRadius: 10 }} source={{ uri: item.src }} />
                                    <Text numberOfLines={1} style={{ flex: 1, fontSize: 16, color: 'black', flexWrap: "wrap", paddingHorizontal: 4, flexGrow: 2 }}>{_capitalize(item.name)}</Text>
                                    <List.Icon icon="keyboard-arrow-right" />
                                </View>
                            </TouchableRipple>
                        </View>
                    }
                />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BridgeListScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: { padding: 20 },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 5,
        borderColor: 'gray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowColor: 'gray',
        elevation: 2
    }
})