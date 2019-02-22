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
    FlatList,
    Image,
    Slider
} from 'react-native'
import { Appbar, Divider, List, TouchableRipple, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { fetchbridges } from '../actions';
import BridgeStatus from '../components/BridgeStatus';
import Entypo from 'react-native-vector-icons/Entypo'
import SliderAppbar from '../components/SliderAppbar';
import SearchAppbar from '../components/SearchAppbar';

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
        this.state = {
            selectedDistance: 10,
            isSearchBarVisible: false,
            isSliderLocationVisible: false
        }
    }

    componentDidMount = () => {
        this.props.fetchbridges();
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        if (params.isSearchBarVisible) {
            return ({
                header: (
                    <SearchAppbar
                        onBlur={params.onSearchClick}
                        onChangeText={(text) => { params.onSearchBarChangeText(text); }}
                        value={params.searchBarTextValue}
                        onIconPress={params.onSearchClick}
                    />
                )
            })
        } else if (params.isSliderLocationVisible) {
            return ({
                header: (
                    <SliderAppbar
                        onCancelClick={params.onFilterLocationClick}
                        disabled={!params.onDistanceChange}
                        onValueChange={params.onDistanceChange}
                        value={params.selectedDistance}
                        suffix={' miles away'}
                        showTitle={true}
                    />)
            })
        }

        return ({
            header: (
                <Appbar.Header>
                    <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
                    <Appbar.Content title={navigation.getParam('title', 'default')} />
                    < Appbar.Action disabled={!params.onSearchClick} icon="search" onPress={() => { if (params) { params.onSearchClick() } }} />
                    < Appbar.Action disabled={!params.onFilterLocationClick} icon={() => <Entypo name="ruler" size={24} color="white" />} onPress={() => { params.onFilterLocationClick() }} />
                </Appbar.Header>
            )
        })
    };

    componentWillMount = () => {
        this.props.navigation.setParams({
            onSearchBarChangeText: text => console.log(text),
            isSearchBarVisible: this.state.isSearchBarVisible,
            onSearchClick: this._flagSearchbarVisible,

            onFilterLocationClick: this._onFilterLocationClick,
            selectedDistance: this.state.selectedDistance,
            onDistanceChange: this._onDistanceChange,
            isSliderLocationVisible: this.state.isSliderLocationVisible,
        })
    }

    _onDistanceChange = (selectedDistance) => {
        this.setState({ selectedDistance })
        this.props.navigation.setParams({ selectedDistance })
    }

    _onFilterLocationClick = () => {
        this.props.navigation.setParams({
            isSliderLocationVisible: !this.props.navigation.state.params.isSliderLocationVisible
        })
    }

    _flagSearchbarVisible = () => {
        this.props.navigation.setParams({
            isSearchBarVisible: !this.props.navigation.state.params.isSearchBarVisible
        })
    }

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
                            <TouchableRipple onPress={() => this._onItemListClick('Detail', { bridge: item })} style={{ padding: 4 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Image style={{ width: 100, height: 60, overflow: 'hidden', borderRadius: 10 }} source={{ uri: item.src }} />
                                    <View style={{ flex: 1, flexDirection: 'column', flexGrow: 2, paddingHorizontal: 4 }}>
                                        <Text numberOfLines={1} style={{ flex: 1, fontSize: 16, color: 'black', flexWrap: "wrap" }}>{_capitalize(item.name)}</Text>
                                        <BridgeStatus bridge={item} />
                                    </View>
                                    <List.Icon icon="keyboard-arrow-right" />
                                </View>
                            </TouchableRipple>
                            <Divider />
                        </View>
                    }
                />
                <Button onPress={this._flagSearchbarVisible}>SEARCHBAR</Button>
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