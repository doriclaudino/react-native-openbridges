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

import BridgeStatus from '../components/BridgeStatus';
import Entypo from 'react-native-vector-icons/Entypo'
import SliderAppbar from '../components/SliderAppbar';
import SearchAppbar from '../components/SearchAppbar';
import { capitalizeSentence, filterNameAndLocation } from '../helpers'
import { fetchbridges, fetchUI, updatedSelectDistance, updateSearchBarValue, setCurrentUserLocation } from '../actions';
import { PermissionsAndroid } from 'react-native';

const mapStateToProps = (state) => {
    return { bridges: state.bridges, ui: state.ui }
}

const mapDispatchToProps = { fetchbridges, fetchUI, updatedSelectDistance, updateSearchBarValue, setCurrentUserLocation }

class BridgeListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDistance: 10,
            currentUserLocation: {
                lat: 42.3863,
                lng: -71.0227
            },
            isSearchBarVisible: false,
            isSliderLocationVisible: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        if (params.isSearchBarVisible) {
            return ({
                header: (
                    <SearchAppbar
                        onBlur={params.onSearchClick}
                        onChangeText={(text) => { params.onSearchBarChangeText(text); navigation.setParams({ searchBarValue: text }) }}
                        value={params.searchBarValue}
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
                        onValueChange={(value) => {
                            params.onDistanceChange(value);
                            navigation.setParams({ selectedDistance: value });
                        }}
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


    componentWillReceiveProps({ ui }) {
        if (this.props.navigation.getParam('selectedDistance') !== ui.selectedDistance
            && ui.selectedDistance) {
            this.props.navigation.setParams({ selectedDistance: ui.selectedDistance });
        }

        if (this.props.navigation.getParam('searchBarValue') !== ui.searchBarValue
            && ui.searchBarValue) {
            this.props.navigation.setParams({ searchBarValue: ui.searchBarValue });
        }
    }

    componentDidMount = () => {
        this.props.fetchbridges();
        this.props.fetchUI();

        this.props.navigation.setParams({
            onSearchBarChangeText: this._onSearchBarChangeText,
            onSearchClick: this._flagSearchbarVisible,
            onDistanceChange: this._onDistanceChange,
            onFilterLocationClick: this._onFilterLocationClick,
        })
    }

    _onSearchBarChangeText = (text) => {
        this.props.updateSearchBarValue(text)
    }

    _onDistanceChange = (selectedDistance) => {
        this.props.updatedSelectDistance(selectedDistance)
    }

    _onFilterLocationClick = () => {
        this.props.navigation.setParams({
            isSliderLocationVisible: !this.props.navigation.state.params.isSliderLocationVisible
        })
        this._saveCurrentUserLocation()

    }

    _flagSearchbarVisible = () => {
        this.props.navigation.setParams({
            isSearchBarVisible: !this.props.navigation.state.params.isSearchBarVisible
        })
    }

    _onItemListClick = (navigateTo, item) => {
        this.props.navigation.navigate(navigateTo, item);
    }

    _saveCurrentUserLocation = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, null);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                navigator.
                    geolocation.getCurrentPosition((pos) => this.props.setCurrentUserLocation(pos),
                        (error) => console.log(error))
            } else {
                console.log('ACCESS_FINE_LOCATION permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        const { currentUserLocation, selectedDistance, searchBarValue } = this.props.ui

        mapUserLocation = {}
        if (currentUserLocation) {
            mapUserLocation.lat = currentUserLocation.coords.latitude
            mapUserLocation.lng = currentUserLocation.coords.longitude
        }

        filteredBridges = this.props.bridges.filter(bridge => filterNameAndLocation(bridge, searchBarValue, mapUserLocation, selectedDistance))
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
                                        <Text numberOfLines={1} style={{ flex: 1, fontSize: 16, color: 'black', flexWrap: "wrap" }}>{capitalizeSentence(item.name)}</Text>
                                        <BridgeStatus bridge={item} />
                                    </View>
                                    <List.Icon icon="keyboard-arrow-right" />
                                </View>
                            </TouchableRipple>
                            <Divider />
                        </View>
                    }
                />
                <Button onPress={this._requesGPS}>GPS</Button>
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