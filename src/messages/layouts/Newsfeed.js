import React, { Component } from 'react'
import MessageFormContainer from '../components/messageform/MessageFormContainer'
import MessageListContainer from '../components/messagelist/MessageListContainer'

class Newsfeed extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return (
      <main className="container">
        <div className="row justify-content-center my-4">
          <MessageFormContainer />
        </div>
        <div>
          <div className="row my-4">
            <div className="">
              <MessageListContainer />
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Newsfeed
