import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-navigation';
import { Button, Avatar, IconButton } from "react-native-paper";
import firebase from 'react-native-firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



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

    _handleOpenBridges = () => {
        console.log('_handleOpenBridges')
        props.navigation.navigate('Bridges');
        props.navigation.closeDrawer();
    }

    return (
        < ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>


                <View style={styles.container}>
                    {
                        firebase.auth().currentUser &&
                        <View style={{
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: "center",
                            justifyContent: "space-between"

                        }}>
                            <IconButton
                                icon='exit-to-app'
                                onPress={this._handleOnLogoutPress}
                                size={20}
                                color={`#6200ee`}
                            ></IconButton>
                            < IconButton
                                icon='link'
                                onPress={this._handleOnLinkAccountsPress}
                                size={20}
                                color={`#6200ee`}
                            ></IconButton>

                        </View>
                    }
                    <View style={{ flexDirection: 'row', height: 200, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar.Image style={{ selfAlign: 'center' }} size={150} source={{ uri: 'https://www.w3schools.com/howto/img_avatar.png' }} />
                    </View>
                    < Button
                        style={styles.button}
                        icon={() => <MaterialCommunityIcons name="bridge" size={24} color="white" />}
                        mode="contained"
                        onPress={this._handleOpenBridges}
                        color={`#6200ee`}
                    >BRIDGES</Button>
                </View>
            </SafeAreaView>
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