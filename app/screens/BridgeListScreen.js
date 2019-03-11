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
    Slider,
    PermissionsAndroid,
    Animated
} from 'react-native'
import { Appbar, Divider, List, TouchableRipple, Button, ActivityIndicator, Snackbar, Chip, Banner, Colors } from 'react-native-paper';
import { connect } from 'react-redux';
import BridgeItem from '../components/BridgeItem'
import Entypo from 'react-native-vector-icons/Entypo'
import SliderAppbar from '../components/SliderAppbar';
import SearchAppbar from '../components/SearchAppbar';
import { capitalizeSentence, filterNameAndLocation } from '../helpers'
import { fetchbridges, fetchOrCreateUI, updatedSelectDistance, updateSearchBarValue, setCurrentUserLocation } from '../actions';

const mapStateToProps = (state) => {
    loading = true
    filteredBridges = []
    if (state.ui && state.bridges && state.bridges.length) {
        filteredBridges = state.bridges
            .filter(bridge => filterNameAndLocation(bridge, state.ui.searchBarValue, state.ui.currentUserLocation, state.ui.selectedDistance))
            .sort((a, b) => a.distance - b.distance)
        loading = false
    }
    return { ui: state.ui, loading, filteredBridges }
}

const mapDispatchToProps = { fetchbridges, fetchOrCreateUI, updatedSelectDistance, updateSearchBarValue, setCurrentUserLocation }

class BridgeListScreen extends Component {
    constructor(props) {
        super(props);
        gpsListener = {}
        this.state = {
            bannerVisible: false,
            initialY: new Animated.Value(-300),
        }
        Snackbar.DURATION_SHORT = 2000

        this.bannerTimeout;
        this.gpsOptions = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000 //in milliseconds
        };

        this.locationIcon = {
            pending: 'location-searching',
            disable: 'location-disabled',
            enable: 'my-location'
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
                        onCancelClick={params.onSliderLocationCloseClick}
                        disabled={!params.onDistanceChange}
                        minimumValue={params ?.sliderLocationOptions ?.minimumValue}
                        maximumValue={params ?.sliderLocationOptions ?.maximumValue}
                        step={params ?.sliderLocationOptions ?.step}
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
                    {params.currentUserLocation && < Appbar.Action disabled={!params.onFilterLocationClick} icon={() => <Entypo name="ruler" size={24} color="white" />} onPress={() => { params.onFilterLocationClick() }} />}
                    < Appbar.Action disabled={!params.onRequestLocationClick} icon={params.locationIcon} onPress={() => { params.onRequestLocationClick() }} />
                </Appbar.Header>
            )
        })
    };


    componentWillReceiveProps({ ui, loading }) {
        if (!loading) {
            if (this.props.navigation.getParam('sliderLocationOptions') !== ui ?.sliderLocationOptions) {
                this.props.navigation.setParams({ sliderLocationOptions: ui.sliderLocationOptions });
            }

            if (this.props.navigation.getParam('selectedDistance') !== ui ?.selectedDistance) {
                this.props.navigation.setParams({ selectedDistance: ui.selectedDistance });
            }

            if (this.props.navigation.getParam('currentUserLocation') !== ui ?.currentUserLocation) {
                this.props.navigation.setParams({ currentUserLocation: ui.currentUserLocation });
            }

            if (this.props.navigation.getParam('searchBarValue') !== ui ?.searchBarValue) {
                this.props.navigation.setParams({ searchBarValue: ui.searchBarValue });
            }
        }
    }


    _onWatchUserLocationError = (error) => {
        this._updateLocationIcon(this.locationIcon.disable)
        navigator.geolocation.clearWatch(this.gpsListener)

        if (this._existCurrentUserLocation())
            this._showSnackBar('Using your old GPS location.', { label: 'Turn ON', onPress: () => console.log('press turn on gps on settings') })
        else
            this._showSnackBar('Location history not found.', { label: 'Turn ON', onPress: () => console.log('press turn on gps on settings') })
    }

    _sucessPosition = (pos) => {
        this.props.setCurrentUserLocation(pos);
        this._updateLocationIcon(this.locationIcon.enable)
    }

    componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.gpsListener)
    }

    componentWillMount = () => {
        this.props.fetchbridges();
        this.props.fetchOrCreateUI();
        clearTimeout(this.bannerTimeout)
    }

    componentDidMount = () => {
        this.props.navigation.setParams({
            onSearchBarChangeText: this._onSearchBarChangeText,
            onSearchClick: this._flagSearchbarVisible,
            onDistanceChange: this._onDistanceChange,
            onRequestLocationClick: this._onRequestLocationClick,
            onFilterLocationClick: this._flagSliderLocationVisible,
            onSliderLocationCloseClick: this._flagSliderLocationVisible,
            locationIcon: this.locationIcon.pending,
        })

        /**
         * slide when user enter on Bridge GPS Boundary
         */
        this.bannerTimeout = setTimeout(() => {
            this.slide()
        }, 2000);
    }

    _onRequestLocationClick = () => {
        this._watchUserPosition()
    }


    _onSearchBarChangeText = (text) => {
        this.props.updateSearchBarValue(text)
    }

    _onDistanceChange = (selectedDistance) => {
        this.props.updatedSelectDistance(selectedDistance)
    }

    _updateLocationIcon = (icon) => {
        this.props.navigation.setParams({
            locationIcon: icon
        })
    }

    _getCurrentPositionOnce = async () => {
        await navigator.geolocation.getCurrentPosition(this._sucessPosition, (error) => {
            if (this._existCurrentUserLocation())
                this._showSnackBar('Using your old GPS location.', { label: 'Turn ON', onPress: () => console.log('press turn on gps on settings') })
            else
                this._showSnackBar(error.message, { label: 'Turn ON', onPress: () => console.log('press turn on gps on settings') })
            this._updateLocationIcon(this.locationIcon.disable)
        }, this.gpsOptions);
    }

    _flagSliderLocationVisible = () => {
        if (this._existCurrentUserLocation())
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

    _watchUserPosition = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, null);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this._updateLocationIcon(this.locationIcon.pending)
                this.gpsListener = navigator.geolocation.watchPosition(this._sucessPosition, this._onWatchUserLocationError, this.gpsOptions);
            } else {
                if (this._existCurrentUserLocation())
                    this._showSnackBar('Using your old GPS location.', { label: 'Turn ON', onPress: () => console.log('press turn on gps on settings') })
                else
                    this._showSnackBar('Location history not found.', { label: 'Turn ON', onPress: () => console.log('press turn on gps on settings') })
            }
        } catch (err) {
            console.warn(err);
        }
    }

    _existCurrentUserLocation = () => {
        if (!this.props.ui || !this.props.ui.currentUserLocation)
            return false
        else
            return true
    }

    _showSnackBar = (snackBarMessage, snackBarAction) => {
        this.setState({ snackBarMessage, snackBarAction, snackBarVisible: true })
    }

    _renderSnackBar = () => {
        return (
            <Snackbar
                visible={this.state.snackBarVisible}
                onDismiss={() => this.setState({ snackBarVisible: false })}
                action={this.state.snackBarAction}
                duration={Snackbar.DURATION_SHORT}
            >
                {this.state.snackBarMessage}
            </Snackbar>
        )
    }

    slide = () => {
        const initialY = new Animated.Value(-300);
        if (!this.state.bannerVisible) {
            this.setState({
                bannerVisible: true,
            })
            Animated.spring(this.state.initialY, {
                speed: 1,
                toValue: 0,
            }).start();
        } else {
            this.setState({
                bannerVisible: false,
                initialY: new Animated.Value(-300),
            });
        }
    };


    render() {
        const { filteredBridges, loading } = this.props


        if (loading)
            return (<View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator></ActivityIndicator></View>)

        return (
            <View style={styles.container}>
                {
                    this.state.bannerVisible &&
                    <Animated.View style={[styles.animatedBanner, { transform: [{ translateY: this.state.initialY }] }]}>
                        <Button onPress={() => this.slide()}>Hide</Button>
                    </Animated.View>
                }

                <FlatList
                    style={styles.container}
                    data={filteredBridges}
                    extraData={filteredBridges}
                    keyExtractor={(item, index) => `${item.id}`}
                    renderItem={({ item }) => <BridgeItem bridge={item} onPress={() => this._onItemListClick('Detail', { bridge: item })} />}
                />
                {this._renderSnackBar()}
            </View >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BridgeListScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    animatedBanner: {
        backgroundColor: Colors.yellow100, height: 100, width: '100%',
    },
    item: { padding: 20 },
    itemContainer: {
        flexDirection: 'column',
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