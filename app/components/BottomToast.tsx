import * as React from 'react'
import { Animated, Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import { AnimatedValue } from 'react-navigation'
import { Surface } from 'react-native-paper'

interface Props {
  visible: boolean
  children: React.ReactNode
  duration: number
  showIn?: number
  hideIn?: number
  onDismiss: () => void
}

interface State {
  hidden: boolean
  opacity: AnimatedValue

}

export default class BottomToast extends React.Component<Props, State> {
  static EFFECT_SHOW_IN: number = 500 /* in ms */
  static EFFECT_HIDE_IN: number = 100 /* in ms */
  handleTimeout: any

  constructor(props: Props) {
    super(props)

    this.state = {
      hidden: !this.props.visible,
      opacity: new Animated.Value(0),
    }
  }

  show = () => {
    clearTimeout(this.handleTimeout)
    this.setState({
      hidden: false,
    })
    const showIn = this.props.showIn ? this.props.showIn : BottomToast.EFFECT_SHOW_IN
    const finalValue = 1

    Animated.timing(this.state.opacity, {
      toValue: finalValue,
      duration: showIn,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        const { duration } = this.props
        const isInfinity =
          duration === Number.POSITIVE_INFINITY ||
          duration === Number.NEGATIVE_INFINITY

        if (finished && !isInfinity) {
          this.handleTimeout = setTimeout(this.props.onDismiss, duration)
        }
      }
    })
  }

  hide = () => {
    clearTimeout(this.handleTimeout)
    const finalValue = 0
    const hideIn = this.props.hideIn ? this.props.hideIn : BottomToast.EFFECT_HIDE_IN

    Animated.timing(this.state.opacity, {
      toValue: finalValue,
      duration: hideIn,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.setState({ hidden: true })
      }
    })
  }

  componentDidMount() {
    if (this.props.visible) {
      this.show()
    }
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.visible !== this.props.visible) {
      this.toggle()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.handleTimeout)
  }

  toggle = () => {
    if (this.props.visible) {
      this.show()
    } else {
      this.hide()
    }
  }

  render() {
    const { visible, children } = this.props

    if (this.state.hidden) {
      return null
    }

    return (
      <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
        <Surface
          pointerEvents="box-none"
          accessibilityLiveRegion="polite"
          style={[
            styles.container,
            {
              opacity: this.state.opacity,
              transform: [
                {
                  scale: visible
                    ? this.state.opacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    })
                    : 1,
                },
              ],
            },
          ]}
        >
          {children}
        </Surface>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 0,
    borderRadius: 4,
  },
})
