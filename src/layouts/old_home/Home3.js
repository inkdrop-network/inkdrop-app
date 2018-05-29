import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MessageContainer from './Message'

class Home extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts
    this.state = {
      content: '',
    }

    this.dataKey = this.contracts.InkDrop.methods.getMessageCount.cacheCall()

    this.renderMessages = this.renderMessages.bind(this)
  }

  onContentChange(event) {
    this.setState({ content: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.content === '' && this.state.content.length < 2) {
      return alert('Please share something valuable.')
    }

    // this.props.onMessageSubmit(this.state.content, this.state.username, this.state.imgUrl)
    this.contracts.InkDrop.methods.createMessage.cacheSend(this.state.content, 10)
    this.setState({ content: '' })
  }

  handleSetButton() {
    this.contracts.InkDrop.methods.createUser.cacheSend(
      '0x6d696b6173000000000000000000000000000000000000000000000000000000',
      'bio',
      'QmVzxY7b5XAZdLudVccmhSGUqPt1PTKs6oRSmXrCW9URcY'
    )
  }

  renderMessages(count) {
    let messages = []
    for (let i = 0; i < count; i++) {
      messages.push(<MessageContainer id={i} key={i} />)
    }

    return messages
  }

  render() {
    var messageCount
    // If the data isn't here yet, show loading
    if (this.dataKey in this.props.InkDrop.getMessageCount) {
      // If the data is here, get it and display it
      messageCount = this.props.InkDrop.getMessageCount[this.dataKey].value
    }
    return (
      <div id="send-area">
        <br />
        <br />
        <button className="pure-button" type="button" onClick={this.handleSetButton.bind(this)}>
          Create User
        </button>
        <br />
        <br />
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="textarea"
            name="text"
            rows="2"
            id="content"
            placeholder="Share something valuable"
            value={this.state.content}
            onChange={this.onContentChange.bind(this)}
          />
          <button color="green">Send</button>
        </form>
        <p>Messages: {messageCount}</p>
        <div>{this.renderMessages(messageCount)}</div>
      </div>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object,
}

export default Home
