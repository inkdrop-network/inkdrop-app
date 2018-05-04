import React, { Component } from 'react'
import MessageItemContainer from '../messageitem/MessageItemContainer'

class MessageList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: this.props.messages,
    }
  }

  componentDidMount() {
    this.props.getAllMessages()
  }

  render() {
    return (
      <div id="messages" className="col-sm-7">
        {this.props.messages.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
      </div>
    )
  }
}

export default MessageList
