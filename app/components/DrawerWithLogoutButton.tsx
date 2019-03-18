import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView, DrawerItemsProps } from 'react-navigation'
import { Button, Avatar, IconButton } from 'react-native-paper'
import firebase from 'react-native-firebase'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface RouteParams {
  linkAccounts?: boolean,
  title?: string,
  onSignInSuccess?: () => void
}

const DrawerWithLogoutButton = (props: DrawerItemsProps) => {
  const _handleOnLogoutPress = () => {
    const routeName = 'SignInOptions'
    const routeParams: RouteParams = {
      title: 'Credentials',
      linkAccounts: false,
      onSignInSuccess: () => props.navigation.navigate('App'),
    }
    firebase.auth()
      .signOut()
      .then(() => props.navigation.navigate(routeName, routeParams))
      .catch((error) => { console.log(error) })
  }

  const _handleOnLinkAccountsPress = () => {
    const routeName = 'LinkAccount'
    const routeParams: RouteParams = {
      title: 'Link Accounts',
      linkAccounts: true,
    }
    props.navigation.navigate(routeName, routeParams)
  }

  const _handleOpenBridges = () => {
    const routeName = 'Bridges'
    props.navigation.navigate(routeName)
    props.navigation.closeDrawer()
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>

        <View style={styles.container}>
          {
            firebase.auth().currentUser &&
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',

              }}
            >
              <IconButton
                icon="exit-to-app"
                onPress={_handleOnLogoutPress}
                size={20}
                color={`#6200ee`}
              />
              < IconButton
                icon="link"
                onPress={_handleOnLinkAccountsPress}
                size={20}
                color={`#6200ee`}
              />
            </View>
          }
          <View style={styles.containerAvatar}>
            <Avatar.Image
              style={{ selfAlign: 'center' }}
              size={150}
              source={{ uri: 'https://www.w3schools.com/howto/img_avatar.png' }}
            />
          </View>
          < Button
            style={styles.button}
            icon={() => <MaterialCommunityIcons name="bridge" size={24} color="white" />}
            mode="contained"
            onPress={_handleOpenBridges}
            color={`#6200ee`}
          >
            BRIDGES
          </Button>
        </View>
      </SafeAreaView>
    </ScrollView >
  )
}

export default DrawerWithLogoutButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  containerAvatar: {
    flexDirection: 'row',
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    marginVertical: 3,
    borderRadius: 0,
  },
})
