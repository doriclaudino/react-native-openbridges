# Open Bridges Open?👍 Close?👎

## Screenshots

![screenshot-1](https://lh3.googleusercontent.com/O5yrHQ6Lo4fqSQ1S6dVKneG13aafrj0pM1Ou2agnLFD3H95l0oxoLbISIAAqE3WQzA=w2560-h1297-rw)
![screenshot-2](https://lh3.googleusercontent.com/yZbLlwPHwO6PpLjtrl7ANY18_4dM0rAW4EB0yvgKwSXx9hL22jIh3yglxQYB6_44pL71=w2560-h1297-rw)
![screenshot-2](https://lh3.googleusercontent.com/JCGq4Ipd5s7QtEgcbcG8bOwjfBS9-JlVqlghGNZTJStOi9ThVjZwW8YdO5SgwsRDL7A=w2560-h1297-rw)

## Project Setup

Project to track the DrawBridges status (up/down)

1.  Run
    1.  Enter the project folder
    2.  connect your device _using usb debug mode_ or a Virtual Device.
    3.  react-native run-_<android/ios>_

1)  Open on your device
    1.  using devTools link
        1.  Open the DevTools url, something like: `Expo DevTools is running at http://localhost:19002`
        2.  press press run on Android Device/Simulator

# Debugging

- install:
  - yarn global add react-devtools

* usefull commands:
  - use toggle inspector (in app)
  - remote JS debugging
  - react-devtools and Ctrl Shift I on Windows opened URL
  - adb shell input keyevent 82 `(send the options to the phone or shake)`
  - adb logcat \*:S ReactNative:V ReactNativeJS:V
  - react-native log-ios
  - react-native log-android
  - react-devtools
  - adb shell am start -n packagename/.MainActivity `(reopen the app)`
  - adb shell input text "word" `usefull when retype from pc`
  - npm start -- --reset-cache `reset cache`
  - adb reverse tcp:8081 tcp:8081 `force the reverse connection from phone-pc`
  - inside android run ./gradlew assembleRelease

- release commands:
  - cd android && ./gradlew assembleRelease
  - output /android/app/build/outputs/apk/release/app-release.apk
  - react-native run-android --variant=release

for more:
https://facebook.github.io/react-native/docs/debugging
