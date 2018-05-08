import React, { Component } from 'react'
import MessageItemContainer from '../messageitem/MessageItemContainer'

class UserPage extends Component {
  constructor(props, { authData }) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props.params.id)
    this.props.getUserMessages(this.props.params.id)
  }

  componentWillUnmount() {
    this.props.resetUserMessages()
  }

  render() {
    return (
      <main className="user-page">
        <div className="container-fluid px-0">
          <img
            id="profile-top-picture"
            className=""
            src="https://picsum.photos/1440/350/?random"
            alt=""
          />
          <div className="nav-profile" />
        </div>
        <div className="container">
          <div className="row my-4">
            <div id="profile" className="col-sm-3 text-left">
              <img
                id="profile-page-picture"
                className="profile-img-lg"
                src="http://via.placeholder.com/190/29313e/29313e"
                alt=""
              />
              <h3 id="profile-page-username" className="mt-4 mb-1">
                c/{this.props.params.name}
              </h3>
              <div id="profile-page-occupation" />
              <div id="follow-buttons">
                <button id="follow-user-button" className="btn btn-green my-4 px-4 d-block">
                  Follow
                </button>
              </div>
              <img src="icons/icon-profile-drop.svg" width="35" height="35" className="" alt="" />
              <span id="profile-page-drops" className="ml-1" />

              <img
                src="icons/icon-profile-subs.svg"
                width="35"
                height="35"
                className="ml-5"
                alt=""
              />
              <span id="profile-page-subs" className="ml-1" />
            </div>
            <div id="profile-page-messages" className="col-sm-7">
              <div className="justify-content-center my-4" />
              {this.props.usermessages.map(msg => (
                <MessageItemContainer message={msg} key={msg.id} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default UserPage
