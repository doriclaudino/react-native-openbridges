import * as React from 'react';
import { Text } from 'react-native'
import { Card } from 'react-native-paper';
import Moment from 'react-moment';


/** EXAMPLE SU LEARN CLASS */
class Status {
    constructor(date) {
        this.when = date ? new Date(date) : null
    }
}

class UnkownStatus extends Status {
    constructor() {
        super()
        this.color = '#9775AA'
        this.status = 'NO HISTORY FOUND '
    }
}

class OpenedStatus extends Status {
    constructor(date) {
        super(date)
        this.color = '#31E28D'
        this.status = 'OPENED '
    }
}

class ClosedStatus extends Status {
    constructor(date) {
        super(date)
        this.color = '#D12028'
        this.status = 'CLOSED '
    }
}

class TransictionColor extends Status {
    constructor(date) {
        super(date)
        this.color = '#F4AD07'
    }
}

class OpeningStatus extends TransictionColor {
    constructor(date) {
        super(date)
        this.status = 'OPENING '
    }
}

class ClosingStatus extends TransictionColor {
    constructor(date) {
        super(date)
        this.status = 'CLOSING '
    }
}

export default class extends React.Component {
    canChangeStatus = (statusThreshold, nextEvent) => {
        let now = new Date();
        return nextEvent && new Date(nextEvent.when) <= now.setMinutes(now.getMinutes() + statusThreshold)
    }

    filterNextEvent = (bridge) => {
        statusThreshold = bridge.statusThreshold || 10;
        nextEvent = bridge.events.filter(event => event && new Date() <= new Date(event.when)).sort((a, b) => { return new Date(a.when) - new Date(b.when); })[0] || undefined
        if (nextEvent) {
            let when = nextEvent.when
            if (this.canChangeStatus(statusThreshold, nextEvent)) {
                if (this.isClose(nextEvent))
                    return new ClosingStatus(when)
                else
                    return new OpeningStatus(when)
            }
        }
        return null
    }

    filterLastEvent = (bridge) => {
        statusThreshold = bridge.statusThreshold || 10;
        lastEvent = bridge.events.filter(event => event && new Date() > new Date(event.when)).sort((a, b) => { return new Date(b.when) - new Date(a.when); })[0] || undefined
        if (lastEvent) {
            if (lastEvent) {
                let when = lastEvent.when
                if (this.isClose(lastEvent))
                    return new ClosedStatus(when)
                else
                    return new OpenedStatus(when)
            }
        }
        return null
    }


    getBridgeStatus = (bridge) => {
        try {
            if (!bridge.events)
                return new UnkownStatus()

            nextEvent = this.filterNextEvent(bridge)
            if (nextEvent)
                return nextEvent

            lastEvent = this.filterLastEvent(bridge)
            if (lastEvent)
                return lastEvent

        } catch (error) {
            console.log(error)
        }
        //by default we show OPEN and green at current datetime if nothing (lasts and nexts) events founded
        return new UnkownStatus()
    }

    isClose = (object) => {
        return object && object.status.toLowerCase().indexOf('close') > -1
    }

    render() {
        const showStatus = this.getBridgeStatus(this.props.bridge)
        return (
            <Card.Content style={{ backgroundColor: showStatus.color, paddingBottom: 0 }}>
                <Text>
                    {showStatus.status}
                    {showStatus.when &&
                        <Moment element={Text} fromNow>
                            {showStatus.when}
                        </Moment>
                    }
                </Text>
            </Card.Content>
        )
    }
}