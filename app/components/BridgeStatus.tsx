import * as React from 'react'
import { Text } from 'react-native'
import { Card } from 'react-native-paper'
import Moment from 'react-moment'
import { Bridge, IStatus, IEvent } from 'store/bridge'
import { getLastEventFromNow, isCloseEventType } from '../helpers';

//tslint:disable:max-classes-per-file
class Status implements IStatus {
  when: Date
  color: string = ''
  status: string = ''
  constructor(date: Date) {
    this.when = new Date(date)
  }
}

class UnkownStatus {
  when?: Date | undefined = undefined
  color: string = '#9775AA'
  status: string = 'NO HISTORY FOUND '
}

class OpenedStatus extends Status {
  constructor(date: Date) {
    super(date)
    this.color = '#31E28D'
    this.status = 'OPENED '
  }
}

class ClosedStatus extends Status {
  constructor(date: Date) {
    super(date)
    this.color = '#D12028'
    this.status = 'CLOSED '
  }
}

class TransictionColor extends Status {
  constructor(date: Date) {
    super(date)
    this.color = '#F4AD07'
  }
}

class OpeningStatus extends TransictionColor {
  constructor(date: Date) {
    super(date)
    this.status = 'OPENING '
  }
}

class ClosingStatus extends TransictionColor {
  constructor(date: Date) {
    super(date)
    this.status = 'CLOSING '
  }
}

interface Props {
  bridge: Bridge
}

export default class extends React.Component<Props> {
  canChangeStatus = (statusThreshold: number, nextEvent: IEvent) => {
    const now = new Date()
    return nextEvent && +new Date(nextEvent.when) <= now.setMinutes(now.getMinutes() + statusThreshold)
  }

  filterNextEvent = (bridge: Bridge) => {
    const statusThreshold = bridge.statusThreshold
    if (bridge.events) {
      const sortEvents = bridge.events
        .filter(event => event && event.when && new Date() <= new Date(event.when))
        .sort((a, b) => {
          return +new Date(a.when) - +new Date(b.when)
        })

      const nextEvent = sortEvents.shift()

      if (nextEvent) {
        if (this.canChangeStatus(statusThreshold, nextEvent)) {
          if (this.isClose(nextEvent)) {
            return new ClosingStatus(nextEvent.when)
          }
          return new OpeningStatus(nextEvent.when)
        }
      }
    }
    return new UnkownStatus()
  }

  filterLastEvent = (bridge: Bridge) => {
    const lastEvent = getLastEventFromNow(bridge)

    if (lastEvent) {
      if (this.isClose(lastEvent)) {
        return new ClosedStatus(lastEvent.when)
      }
      return new OpenedStatus(lastEvent.when)
    }

    return new UnkownStatus()
  }

  getBridgeStatus = (bridge: Bridge) => {
    try {
      if (!bridge.events) {
        return new UnkownStatus()
      }
      const nextEvent = this.filterNextEvent(bridge)
      if (!(nextEvent instanceof UnkownStatus)) {
        return nextEvent
      }
      return this.filterLastEvent(bridge)
    } catch (error) {
      console.log(error)
    }
    //by default we show OPEN and green at current datetime if nothing (lasts and nexts) events founded
    return new UnkownStatus()
  }

  isClose = (event: IEvent) => {
    return isCloseEventType(event)
  }

  render() {
    const { bridge } = this.props
    const showStatus = this.getBridgeStatus(bridge)
    return (
      <Card.Content style={{ backgroundColor: showStatus.color, paddingBottom: 0 }}>
        <Text
          style={{
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
            fontFamily: 'Courier',
          }}
        >
          {showStatus.status}
          {showStatus.when &&
            <Moment element={Text} fromNow={true} >
              {showStatus.when.toISOString()}
            </Moment>
          }
        </Text>
      </Card.Content>
    )
  }
}
