import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MessageItemContainer from '../messageitem/MessageItemContainer'

// icons
import iconDrop from '../../../../public/icons/icon-profile-drop.svg'
import iconSubs from '../../../../public/icons/icon-profile-subs.svg'

class UserPage extends PureComponent {
  componentDidMount() {
    this.props.fetchUserMessages(this.props.address)
  }

  componentWillUnmount() {
    this.props.resetUserMessages()
  }

  render() {
    let user = this.props.user

    // temporary values until the data is fetched from the blockchain
    if (this.props.user === null) {
      user = {
        username: '',
        bio: '',
        drops: '',
        followers: '',
        ipfsHash: '',
        userUrl: '',
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
                src={user.userUrl || 'http://via.placeholder.com/190/29313e/29313e'}
                alt=""
              />
              <h3 id="profile-page-username" className="mt-4 mb-1">
                @{user.username}
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
              {this.props.messages.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
            </div>
          </div>
        </div>
      </main>
    )
  }
}

UserPage.propTypes = {
  address: PropTypes.string,
  user: PropTypes.object,
  messages: PropTypes.array,
}

export default UserPage
