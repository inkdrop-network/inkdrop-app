import React, { Component } from 'react'
import MessageFormContainer from '../../messages/ui/messageform/MessageFormContainer'
import MessageListContainer from '../../messages/ui/messagelist/MessageListContainer'

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
          <div className="row justify-content-center my-4">
            <div className="col-sm-7">
              <MessageListContainer />
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Newsfeed
