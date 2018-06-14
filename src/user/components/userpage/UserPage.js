import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MessageItemContainer from '../../../messages/components/messageitem/MessageItemContainer'

// icons
import iconDrop from '../../../../public/icons/icon-profile-drop.svg'
import iconSubs from '../../../../public/icons/icon-profile-subs.svg'

class UserPage extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    this.state = {
      username: '',
      bio: '',
      drops: '',
      followers: '',
      ipfsHash: '',
      imgUrl: '',
      messages: [],
    }

    this.dataKey = this.contracts.InkDrop.methods.getUser.cacheCall(this.props.address)
  }

  render() {
    let user = this.state
    if (this.dataKey in this.props.InkDrop.getUser) {
      let tmpUser = this.props.InkDrop.getUser[this.dataKey].value
      user = {
        username: this.context.drizzle.web3.utils.toUtf8(tmpUser.username),
        bio: tmpUser.bio,
        drops: parseInt(tmpUser.drops, 10) / 100,
        followers: parseInt(tmpUser.followers, 10),
        ipfsHash: tmpUser.ipfsHash,
        imgUrl: `https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
        messages: tmpUser.messages,
      }
    }

    return (
      <main className="user-page">
        <div className="container">
          <div className="row my-4">
            <div id="profile" className="col-sm-3 mt-2 text-left">
              <img
                id="profile-page-picture"
                className="profile-img-lg"
                src={user.imgUrl || 'http://via.placeholder.com/190/29313e/29313e'}
                alt=""
              />
              <h3 id="profile-page-username" className="mt-4 mb-1">
                c/{user.username}
              </h3>
              <div id="profile-page-occupation">{user.bio}</div>
              <div id="follow-buttons">
                <button id="follow-user-button" className="btn btn-green my-4 px-4 d-block">
                  Follow
                </button>
              </div>
              <img src={iconDrop} width="35" height="35" className="" alt="" />
              <span id="profile-page-drops" className="ml-1">
                {user.drops}
              </span>

              <img src={iconSubs} width="35" height="35" className="ml-5" alt="" />
              <span id="profile-page-subs" className="ml-1">
                {user.followers}
              </span>
            </div>

            <div id="profile-page-messages" className="col-sm-7 mt-2">
              {user.messages.map(msgId => (
                <MessageItemContainer msgId={msgId} cached={false} cachedMsg={false} key={msgId} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }
}

UserPage.propTypes = {
  address: PropTypes.string,
}

UserPage.contextTypes = {
  drizzle: PropTypes.object,
}

export default UserPage
