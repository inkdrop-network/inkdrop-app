import React, { Component } from 'react'
import MessageFormContainer from '../../user/ui/messageform/MessageFormContainer'
import MessageList from '../../user/ui/messagelist/MessageList'

class Newsfeed extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Newsfeed</h1>
            <p><strong>{this.props.authData.name}!</strong></p>
            <p>{this.props.authData.bio}</p>
            <MessageFormContainer />
            <MessageList />
          </div>
        </div>
      </main>
    )
  }
}

export default Newsfeed
