import * as React from 'react'
import { StyleSheet, View, Image, Animated } from 'react-native'
import { Button, Text, IconButton, ProgressBar, Colors } from 'react-native-paper'
import BottomToast from './BottomToast'
import { Bridge } from 'store/bridge'

interface Props {
  onDismiss: () => void
  onConfirmPress: () => void
  duration: number
  visible: boolean
  bridge: Bridge
}

interface State {
  currentProgress: number
  handleInterval: any
  mounted: boolean
}

export default class ConfirmBridgeStatus extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = this.getInitialState(props)
  }
  getInitialState = (props: Props): State => {
    return {
      currentProgress: 0,
      handleInterval: undefined,
      mounted: false,
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.visible !== nextProps.visible) {
      clearInterval(this.state.handleInterval)
      this.setState(this.getInitialState(nextProps), this.restartAnimation)
    }
  }

  restartAnimation = () => {
    const steps = 100
    const final = 1
    const increment = final / steps //0.04 for 25 steps
    const callEvery = this.props.duration / steps

    const interval = setInterval(() => this.increment(increment), callEvery)
    this.setState({ handleInterval: interval })
  }

  increment(increment: number) {
    this.setState({ currentProgress: this.state.currentProgress + increment })
  }

  componentDidMount() {
    this.setState({ mounted: true }, this.restartAnimation)
  }

  componentWillUnmount() {
    clearInterval(this.state.handleInterval)
    this.setState({ mounted: false })
  }

  render() {
    if (!this.props.bridge) {
      return null
    }
    return (
      <BottomToast
        visible={this.props.visible}
        onDismiss={this.props.onDismiss}
        duration={this.props.duration}
      >
        <View style={styles.container}>
          <ProgressBar
            progress={this.state.currentProgress}
            color={Colors.red800}
            style={styles.progressBras}
          />
          <View style={styles.imgContainer}>
            <Image style={styles.image} source={{ uri: this.props.bridge.src }} />
          </View>
          <View
            style={{
              flex: 1,
              width: '100%',
            }}
          >
            <View style={styles.rightSegment}>
              <IconButton icon="close" style={styles.closeButton} onPress={this.props.onDismiss} />
              <Text
                style={{ margin: 5, fontSize: 18, }}
              >
                is this bridge closed?
              </Text>
              <Button
                mode="contained"
                icon="thumb-up"
                onPress={() => {
                  this.props.onConfirmPress()
                }}
              >
                CONFIRM
              </Button>
            </View>
          </View>
        </View>
      </BottomToast>
    )
  }
}

const styles = StyleSheet.create({
  rightSegment: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  imgContainer: {
    marginVertical: 0,
    marginLeft: 6,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBras: {
    width: '100%', height: 5, position: 'absolute', top: -10,
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 120,
    backgroundColor: 'gray',
  },
  image: {
    width: 100,
    height: 60,
    overflow: 'hidden',
    borderRadius: 10,
  },
})
