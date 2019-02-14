# openbridges

#run
react-native run-android

#logs
react-native log-ios
react-native log-android

#logs filter
adb logcat *:S ReactNative:V ReactNativeJS:V

#chrome debug
shake the phone and enable Remove JS Debugging, will open http://localhost:8081/debugger-ui/ then press ⌘⌥I on macOS, Ctrl Shift I on Windows

for more:
https://facebook.github.io/react-native/docs/debugging