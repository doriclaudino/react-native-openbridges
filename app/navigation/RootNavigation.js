import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import BridgeListScreen from '../screens/BridgeListScreen';
import BridgeDetailScreen from '../screens/BridgeDetailScreen';
import PhoneScreen from '../screens/PhoneScreen';

const PhoneAuthStack = createStackNavigator({
    PhoneScreen: {
        screen: PhoneScreen,
        params: {
            title: 'PhoneScreen',
        }
    },
});

const BridgeStack = createStackNavigator({
    List: {
        screen: BridgeListScreen,
        params: {
            title: 'Bridges',
        }
    },
    Detail: {
        screen: BridgeDetailScreen,
    }
});

const DrawerNavigation = createDrawerNavigator({
    Bridges: BridgeStack,
    PhoneAuth: PhoneAuthStack,
},
    {
        initialRouteName: 'Bridges'
    });

export default createAppContainer(DrawerNavigation);