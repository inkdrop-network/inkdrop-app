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
      // check if there was no getMessageCount previously
      (this.dataKey in this.props.InkDrop.getMessageCount &&
        !(this.dataKey in prevProps.InkDrop.getMessageCount)) ||
      // or if the previous getMessageCount is smaller than the current getMessageCount
      (this.dataKey in this.props.InkDrop.getMessageCount &&
        this.dataKey in prevProps.InkDrop.getMessageCount &&
        this.props.InkDrop.getMessageCount[this.dataKey].value >
          prevProps.InkDrop.getMessageCount[this.dataKey].value)
    ) {
      this.props.onMessageCountGot(this.props.InkDrop.getMessageCount[this.dataKey].value)
    }

    for (let i = 0; i < this.props.messages.length; i++) {
      this.updateMessageTx(prevProps, this.props.messages[i])
    }
  }

  updateMessageTx(prevProps, message) {
    let stackId = message.id
    if (this.props.transactionStack[stackId]) {
      const txHash = this.props.transactionStack[stackId]
      if (
        txHash in prevProps.transactions &&
        prevProps.transactions[txHash].status === 'pending' &&
        this.props.transactions[txHash].status === 'success'
      ) {
        console.log('TxHash: ' + txHash)
        console.log('Tx Status: ' + this.props.transactions[txHash].status)
        // TODO: remove message from store
        this.props.onMessageTxSuccess(message)
      }
    }
  }

  render() {
    let msgs = []
    for (let i = this.props.count - 1; i >= 0; --i) {
      msgs.push(i)
    }

    return (
      <div id="messages" className="">
        {this.props.messages.map(msg => (
          <MessageItemContainer msgId={msg.id} cached={true} cachedMsg={msg} key={msg.id} />
        ))}
        {msgs.map(msgId => (
          <MessageItemContainer msgId={msgId} cached={false} cachedMsg={false} key={msgId} />
        ))}
      </div>
    )
  }
}

MessageList.contextTypes = {
  drizzle: PropTypes.object,
}

export default MessageList
