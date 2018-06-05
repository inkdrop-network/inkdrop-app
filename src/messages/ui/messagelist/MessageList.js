import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MessageItemContainer from '../messageitem/MessageItemContainer'

class MessageList extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    this.dataKey = this.contracts.InkDrop.methods.getMessageCount.cacheCall()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.dataKey in this.props.InkDrop.getMessageCount &&
      !(this.dataKey in prevProps.InkDrop.getMessageCount)
    ) {
      this.props.onMessageCountGot(this.props.InkDrop.getMessageCount[this.dataKey].value)
    }
  }

  render() {
    let msgs = []
    for (let i = 0; i < this.props.count; i++) {
      msgs.push(i)
    }

    return (
      <div id="messages" className="">
        {msgs.map(msgId => <MessageItemContainer msgId={msgId} key={msgId} />)}
      </div>
    )
  }
}

MessageList.contextTypes = {
  drizzle: PropTypes.object,
}

export default MessageList
