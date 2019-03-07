import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { Button, Colors, } from "react-native-paper";
import firebase from 'react-native-firebase';


export default DrawerWithLogoutButton = (props) => {

    _handleOnLogoutPress = () => {
        firebase.auth()
            .signOut()
            .then(() => props.navigation.navigate('SignInOptions', { title: 'Credentials', linkAccounts: false, onSignInSuccess: () => props.navigation.navigate('App') }))
            .catch((error) => console.log(error))
    }

    _handleOnLinkAccountsPress = () => {
        props.navigation.navigate('LinkAccount', { title: 'Link Accounts', linkAccounts: true })
    }

    return (
        < ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                <DrawerItems {...props} />
            </SafeAreaView>
            {
                firebase.auth().currentUser &&
                <View style={styles.container}>
                    < Button
                        style={styles.button}
                        icon='link'
                        mode="contained"
                        onPress={this._handleOnLinkAccountsPress}
                        color={Colors.amber500}
                    >Link Accounts</Button>

                    <Button
                        style={styles.button}
                        icon='exit-to-app'
                        mode="contained"
                        color={Colors.red500}
                        onPress={this._handleOnLogoutPress}
                    >Logout</Button>
                </View>
            }
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
    },
    button: {
        width: '100%',
        marginVertical: 3,
        borderRadius: 0
    },
});