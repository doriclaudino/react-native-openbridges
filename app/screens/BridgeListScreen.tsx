/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  PermissionsAndroid,
  Animated,
  Image,
} from 'react-native'
import { Appbar, Button, ActivityIndicator, Snackbar, Colors, FAB, Text, IconButton } from 'react-native-paper'
import { connect } from 'react-redux'
import BridgeItem from '../components/BridgeItem'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SliderAppbar from '../components/SliderAppbar'
import SearchAppbar from '../components/SearchAppbar'
import { filterNameAndLocation } from '../helpers'
import {
  fetchbridges,
  fetchOrCreateUI,
  updatedSelectDistance,
  updateSearchBarValue,
  setCurrentUserLocation
} from '../actions'
import { Bridge } from 'store/bridge'
import { NavigationParams, NavigationScreenProps } from 'react-navigation'
import Geolocation, { GeoPosition, GeoError, GeoWatchOptions } from 'react-native-geolocation-service'
import BottomToast from '../components/BottomToast';

interface Props extends NavigationScreenProps {
  setCurrentUserLocation: (pos: GeoPosition) => void
  updateSearchBarValue: (text: string) => void
  updatedSelectDistance: (distance: number) => void
  fetchOrCreateUI: () => void
  fetchbridges: () => void
  filteredBridges: Bridge[]
  loading: boolean
  ui: any
}
interface State {
  bannerVisible: boolean
  initialY: Animated.Value
  snackBarMessage?: string
  snackBarAction?: object | any
  snackBarVisible: boolean
  gpsListener: number
  bannerTimeout?: NodeJS.Timeout
  gpsOptions: GeoWatchOptions
  locationIcon: locationIcons
}

interface MapState {
  bridges: Bridge[]
  ui: any
  snackBarMessage?: string
  snackBarAction?: object | any
  snackBarVisible: boolean
  gpsListener: number
  bannerTimeout?: NodeJS.Timeout
  gpsOptions: GeoWatchOptions
}

enum locationIcons {
  pending = 'location-searching',
  disable = 'location-disabled',
  enable = 'my-location',
}

const mapStateToProps = (state: MapState, ownProps: Props) => {
  let loading = true
  let filteredBridges: Bridge[] = []
  if (state.ui && state.bridges && state.bridges.length) {
    filteredBridges = state.bridges
      .filter(bridge => filterNameAndLocation(
        bridge,
        state.ui.searchBarValue,
        state.ui.currentUserLocation,
        state.ui.selectedDistance
      ))
      .sort((a, b) => a.distance - b.distance)
  }
  loading = false
  return { loading, filteredBridges, ui: state.ui, }
}

const mapDispatchToProps = {
  fetchbridges,
  fetchOrCreateUI,
  updatedSelectDistance,
  updateSearchBarValue,
  setCurrentUserLocation,
}

class BridgeListScreen extends React.Component<Props, State> {
  state: State = {
    bannerVisible: false,
    initialY: new Animated.Value(-300),
    snackBarVisible: false,
    gpsOptions: {
      enableHighAccuracy: false,
      timeout: 10 * 1000, /* 10 secs */
      maximumAge: 5 * 1000, /* 5 secs */
    },
    gpsListener: -1,
    locationIcon: locationIcons.disable,
  }

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavigationParams>) => {
    const isSearchBarVisible = navigation.getParam('isSearchBarVisible')
    const onSearchBarChangeText = navigation.getParam('onSearchBarChangeText')
    const onSearchClick = navigation.getParam('onSearchClick')
    const searchBarValue = navigation.getParam('searchBarValue')

    const isSliderLocationVisible = navigation.getParam('isSliderLocationVisible')
    const sliderLocationOptions = navigation.getParam('sliderLocationOptions')

    const onSliderLocationCloseClick = navigation.getParam('onSliderLocationCloseClick')
    const onDistanceChange = navigation.getParam('onDistanceChange')
    const selectedDistance = navigation.getParam('selectedDistance')

    const currentUserLocation = navigation.getParam('currentUserLocation')
    const onFilterLocationClick = navigation.getParam('onFilterLocationClick')

    if (isSearchBarVisible) {
      return ({
        header: (
          <SearchAppbar
            onBlur={onSearchClick}
            onChangeText={(text: string) => {
              onSearchBarChangeText(text)
              navigation.setParams({ searchBarValue: text })
            }}
            value={searchBarValue}
            onIconPress={onSearchClick}
          />
        ),
      })
    } if (isSliderLocationVisible) {
      let minimumValue
      let maximumValue
      let step
      if (sliderLocationOptions) {
        minimumValue = sliderLocationOptions.minimumValue
        maximumValue = sliderLocationOptions.maximumValue
        step = sliderLocationOptions.step
      }
      return ({
        header: (
          <SliderAppbar
            onCancelClick={onSliderLocationCloseClick}
            disabled={!onDistanceChange}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            onValueChange={(value: number) => {
              onDistanceChange(value)
              navigation.setParams({ selectedDistance: value })
            }}
            value={selectedDistance}
            suffix={' miles away'}
            showTitle={true}
          />),
      })
    }

    return ({
      header: (
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title={navigation.getParam('title', 'default')} />
          < Appbar.Action disabled={!onSearchClick} icon="search" onPress={() => { onSearchClick() }} />
          {
            currentUserLocation &&
            <Appbar.Action
              disabled={!onFilterLocationClick}
              icon={() => <Entypo name="ruler" size={24} color="white" />}
              onPress={() => { onFilterLocationClick() }}
            />
          }
        </Appbar.Header>
      ),
    })
  }

  compareNavigationParamAndUpdate = (newProps: Props, fields: string[]) => {
    if (newProps.ui) {
      fields.forEach((field) => {
        const oldNavParam = this.props.navigation.getParam(field)
        if (newProps.ui[field] && oldNavParam !== newProps.ui[field]) {
          newProps.navigation.setParams({ [field]: newProps.ui[field] })
        }
      })
    }
  }

  componentWillReceiveProps(props: Props) {
    const isLoading = props.loading
    if (!isLoading) {
      this.compareNavigationParamAndUpdate(
        props,
        ['sliderLocationOptions', 'selectedDistance', 'currentUserLocation', 'searchBarValue']
      )
    }
  }

  _onWatchUserLocationError = (error: GeoError) => {
    this._updateLocationIcon(locationIcons.disable)
    this._clearGeoListener()
    this._showSnackBar(error.message)
  }

  _clearGeoListener = () => {
    Geolocation.clearWatch(this.state.gpsListener)
    this.setState({ gpsListener: -1 })
  }

  _sucessPosition = (pos: GeoPosition) => {
    this.props.setCurrentUserLocation(pos)
    this._updateLocationIcon(locationIcons.enable)
    const bridgeDistance = 0.2 //300 meters?
    const closestBridge = this.props.filteredBridges[0]

    if (this.props.filteredBridges && closestBridge.distance < bridgeDistance && !this.state.bannerVisible) {
      this.setState({ bannerVisible: true })
    }
  }

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.state.gpsListener)
  }

  componentWillMount = () => {
    this.props.fetchbridges()
    this.props.fetchOrCreateUI()
    if (this.state.bannerTimeout) {
      clearTimeout(this.state.bannerTimeout)
    }
  }

  componentDidMount = () => {
    this.props.navigation.setParams({
      onSearchBarChangeText: this._onSearchBarChangeText,
      onSearchClick: this._flagSearchbarVisible,
      onDistanceChange: this._onDistanceChange,
      onFilterLocationClick: this._flagSliderLocationVisible,
      onSliderLocationCloseClick: this._flagSliderLocationVisible,
    })
  }

  _onRequestLocationClick = () => {
    this._watchUserPosition()
  }

  _onSearchBarChangeText = (text: string) => {
    this.props.updateSearchBarValue(text)
  }

  _onDistanceChange = (selectedDistance: number) => {
    this.props.updatedSelectDistance(selectedDistance)
  }

  _updateLocationIcon = (icon: locationIcons) => {
    this.setState({ locationIcon: icon })
  }

  _getCurrentPositionOnce = async () => {
    await Geolocation.getCurrentPosition(this._sucessPosition, (error: any) => {
      if (this._existCurrentUserLocation()) {
        this._showSnackBar(
          'Using your old GPS location.',
          {
            label: 'Turn ON', onPress: () => {
              console.log('press turn on gps on settings')
            },
          })
      } else {
        this._showSnackBar(
          error.message,
          {
            label: 'Turn ON',
            onPress: () => {
              console.log('press turn on gps on settings')
            },
          })
      }
      this._updateLocationIcon(locationIcons.disable)
    }, this.state.gpsOptions)
  }

  _flagSliderLocationVisible = () => {
    this.props.navigation.setParams({
      isSliderLocationVisible: !this.props.navigation.state.params!.isSliderLocationVisible,
    })
  }

  _flagSearchbarVisible = () => {
    this.props.navigation.setParams({
      isSearchBarVisible: !this.props.navigation.state.params!.isSearchBarVisible,
    })
  }

  _onItemListClick = (navigateTo: string, item: NavigationParams) => {
    this.props.navigation.navigate(navigateTo, item)
  }

  _watchUserPosition = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, undefined)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.clearWatch(this.state.gpsListener)
        this._updateLocationIcon(locationIcons.pending)
        const listener = Geolocation.watchPosition(
          this._sucessPosition,
          this._onWatchUserLocationError,
          this.state.gpsOptions
        )
        this.setState({ gpsListener: listener })
      } else {
        if (this._existCurrentUserLocation()) {
          this._showSnackBar(
            'Using your old GPS location.',
            {
              label: 'Turn ON',
              onPress: () => {
                console.log('press turn on gps on settings')
              },
            })
        } else {
          this._showSnackBar(
            'Location history not found.',
            {
              label: 'Turn ON',
              onPress: () => {
                console.log('press turn on gps on settings')
              },
            })
        }
      }
    } catch (err) {
      console.warn(err)
    }
  }

  _existCurrentUserLocation = () => {
    if (!this.props.ui || !this.props.ui.currentUserLocation) {
      return false
    }
    return true
  }

  _showSnackBar = (snackBarMessage: string, snackBarAction?: object | any) => {
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

  render() {
    const { filteredBridges, loading } = this.props
    const closestBridge = filteredBridges[0]

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator />
        </View>)
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.container}
          data={filteredBridges}
          extraData={filteredBridges}
          keyExtractor={(item: Bridge) => `${item.id}`}
          renderItem={({ item }) =>
            <BridgeItem
              bridge={item}
              onPress={() => this._onItemListClick('Detail', { bridge: item })}
            />}
        />
        <BottomToast
          visible={this.state.bannerVisible}
          onDismiss={() => this.setState({ bannerVisible: false })}
          duration={5000}
        >
          {
            closestBridge &&
            <View style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              height: 120,
              paddingHorizontal: 3,
              paddingTop: 3,
              backgroundColor: 'gray'
            }}>
              <View style={{
                marginVertical: 0,
                marginLeft: 6,
                marginRight: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image style={styles.image} source={{ uri: closestBridge.src }} />
              </View>
              <View style={{
                flex: 1,
                width: '100%',
              }}>
                <View style={{
                  flexDirection: 'column',
                  flex: 1,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <IconButton icon="close" style={{ position: 'absolute', top: -10, right: -10 }} onPress={() => { this.setState({ bannerVisible: false }) }} />
                  <Text style={{ margin: 5, fontSize: 18, }}>is this bridge closed?</Text>
                  <Button mode="contained" icon="thumb-up">CONFIRM</Button>
                </View>
              </View>
            </View>
          }
        </BottomToast>
        <FAB
          style={styles.fab}
          small={true}
          icon={() => <MaterialIcons name={this.state.locationIcon} size={24} color="white" />}
          onPress={() => { this._onRequestLocationClick() }}
        />
        {this._renderSnackBar()}
      </View >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BridgeListScreen as any)

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
    elevation: 2,
  },
  fab: {
    backgroundColor: '#6200ee',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  image: {
    width: 100,
    height: 60,
    overflow: 'hidden',
    borderRadius: 10,
  },
})
