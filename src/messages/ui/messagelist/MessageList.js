import React, { Component } from 'react'
import MessageItemContainer from '../messageitem/MessageItemContainer'

class MessageList extends Component {
  componentDidMount() {
    this.props.getAllMessages()
  }

  render() {
    return (
      <div id="messages" className="">
        {this.props.messages.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
      </div>
    )
  }
}

export default MessageList
