import React, { Component } from 'react'
import MessageListMasonryContainer from '../components/messagelist/MessageListMasonryContainer'

class Newsfeed extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return (
      <main className="container">
        <MessageListMasonryContainer />
      </main>
    )
  }
}

export default Newsfeed
