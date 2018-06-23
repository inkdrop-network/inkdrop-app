import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MessageItemContainer from '../messageitem/MessageItemContainer'

class MessageList extends Component {
  componentDidMount() {
    this.props.fetchMessages()
  }

  render() {
    return (
      <div id="messages" className="">
        {this.props.messages.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
      </div>
    )
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
}

export default MessageList
