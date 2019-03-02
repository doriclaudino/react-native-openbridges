import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { Button, Colors } from "react-native-paper";
import firebase from 'react-native-firebase';


export default DrawerWithLogoutButton = (props) => {
    _handleOnPress = () => {
        firebase.auth()
            .signOut()
            .then(() => props.navigation.navigate('Loading'))
            .catch((error) => console.log(error))
    }
    return (
        < ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                <DrawerItems {...props} />
            </SafeAreaView>
            <TouchableOpacity>
                <View style={styles.item}>
                    <Button icon='exit-to-app'
                        mode="contained"
                        color={Colors.red500}
                        style={{ width: '100%' }}
                        onPress={_handleOnPress}
                    >Logout</Button>
                </View>
            </TouchableOpacity>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
});