# Open Bridges  Open?👍  Close?👎




## Firebase Realtime database schema
![Firebase Realtime](https://media.giphy.com/media/47Jko4ZuPBgOgs9LRd/giphy.gif)
![Schedule events](https://media.giphy.com/media/62cXq3zwLS32DTwwDA/giphy.gif)




## Project Setup
Project to track the DrawBridges status (up/down)


1.  Run 
    1.  Enter the project folder
    2.  connect your device *using usb debug mode* or a Virtual Device.
    3.  react-native run-*<android/ios>*



1.  Open on your device
    1.  using devTools link
          1.  Open the DevTools url, something like: `Expo DevTools is running at http://localhost:19002`
          2.  press press run on Android Device/Simulator
         


# Debugging
* install:
    * yarn global add react-devtools


* usefull commands:
    * use toggle inspector (in app)
    * remote JS debugging
    * react-devtools and Ctrl Shift I on Windows opened URL
    * adb shell input keyevent 82 `(send the options to the phone or shake)`
    * adb logcat *:S ReactNative:V ReactNativeJS:V 
    * react-native log-ios
    * react-native log-android
    * react-devtools
    * adb shell am start -n packagename/.MainActivity `(reopen the app)`
    * adb shell input text "word" `usefull when retype from pc`
    * npm start -- --reset-cache `reset cache`
    * adb reverse tcp:8081 tcp:8081 `force the reverse connection from phone-pc`
    * inside android run ./gradlew assembleRelease


for more:
https://facebook.github.io/react-native/docs/debugging
