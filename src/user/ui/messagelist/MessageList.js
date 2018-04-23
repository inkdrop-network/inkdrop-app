import React, { Component } from 'react'

class MessageList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
    }

  }

  componentDidMount() {
    console.log('Get all messages');
    // TODO: Get all inital messages here
    // this.props.getAllMessages();
  }

  createMessage(msg) {
    return <li key={msg.id}>{msg.content}</li>
  }


  render() {
    let msgs = this.state.messages;
    let messageItems = msgs.map(this.createMessage);
    return(
      <ul id="message-list">
        {messageItems}
      </ul>
    )
  }
}

export default MessageList
