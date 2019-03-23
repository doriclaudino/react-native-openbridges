import * as React from 'react'
import { Animated } from 'react-native'
import { AnimatedValue } from 'react-navigation'

interface Props {
  visible: boolean
  children: React.ReactNode
  initialPosition?: number
  showIn?: number
  hideIn?: number
}

interface State {
  visible: boolean
  currentY: AnimatedValue
  dinamicHeight: AnimatedValue
  maxHeight: number
  initialPosition: number
}

export default class VerticalTimingAnimation extends React.Component<Props, State> {
  static SHOW_IN: number = 500
  static HIDE_IN: number = 500
  static INITIAL_POSITION: number = 100

  constructor(props: Props) {
    super(props)
    const initialPosition = this.props.initialPosition
      ? this.props.initialPosition
      : VerticalTimingAnimation.INITIAL_POSITION

    this.state = {
      initialPosition,
      visible: false,
      currentY: new Animated.Value(initialPosition),
      dinamicHeight: undefined,
      maxHeight: 0,
    }
  }

  show = () => {
    const initialValue = 0
    const finalValue = this.state.maxHeight
    const showIn = this.props.showIn ? this.props.showIn : VerticalTimingAnimation.SHOW_IN

    this.state.dinamicHeight.setValue(initialValue)

    const heightAnimation = Animated.timing(this.state.dinamicHeight, {
      duration: showIn,
      toValue: finalValue,
    })
    const positionAnimation = Animated.timing(this.state.currentY, {
      duration: showIn,
      toValue: 0,
    })
    Animated.parallel([heightAnimation, positionAnimation]).start()
  }

  hide = () => {
    const initialValue = this.state.maxHeight
    const finalValue = 0
    const hideIn = this.props.hideIn ? this.props.hideIn : VerticalTimingAnimation.HIDE_IN

    this.state.dinamicHeight.setValue(initialValue)

    const heightAnimation = Animated.timing(this.state.dinamicHeight, {
      duration: hideIn,
      toValue: finalValue,
    })
    const positionAnimation = Animated.timing(this.state.currentY, {
      duration: hideIn,
      toValue: this.state.initialPosition,
    })
    Animated.parallel([heightAnimation, positionAnimation]).start()
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.state.dinamicHeight) {
      nextProps.visible ? this.show() : this.hide()
    }
  }

  getMaxHeight = (e: any) => {
    if (this.state.maxHeight === 0) {
      this.setState({
        maxHeight: e.nativeEvent.layout.height,
        dinamicHeight: new Animated.Value(0),
      })
    }
  }

  render() {
    const { visible, children, ...rest } = this.props
    return (
      <Animated.View
        onLayout={this.getMaxHeight}
        style={{
          backgroundColor: 'gray',
          height: this.state.dinamicHeight,
          transform: this.state.maxHeight === 0 ? [{ translateY: -99999 }] : [{ translateY: this.state.currentY }],
        }}
        {...rest}
      >
        {children}
      </Animated.View>
    )
  }
}
