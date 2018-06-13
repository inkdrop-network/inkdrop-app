import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

    console.log(this.props.address)
    this.dataKey = this.contracts.InkDrop.methods.getUser.cacheCall(this.props.address)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.dataKey in this.props.InkDrop.getUser &&
      !(this.dataKey in prevProps.InkDrop.getUser)
    ) {
      let user = this.props.InkDrop.getUser[this.dataKey].value
      this.setState({
        username: this.context.drizzle.web3.utils.toUtf8(user.username),
        bio: user.bio,
        drops: parseInt(user.drops, 10) / 100,
        followers: parseInt(user.followers, 10),
        ipfsHash: user.ipfsHash,
        imgUrl: `https://gateway.ipfs.io/ipfs/${user.ipfsHash}`,
        messages: user.messages,
      })
    }
  }

  render() {
    return (
      <main className="user-page">
        <div className="container">
          <div className="row my-4">
            <div id="profile" className="col-sm-3 text-left">
              <img
                id="profile-page-picture"
                className="profile-img-lg"
                src={this.state.imgUrl || 'http://via.placeholder.com/190/29313e/29313e'}
                alt=""
              />
              <h3 id="profile-page-username" className="mt-4 mb-1">
                c/{this.state.username}
              </h3>
              <div id="profile-page-occupation">{this.state.bio}</div>
              <div id="follow-buttons">
                <button id="follow-user-button" className="btn btn-green my-4 px-4 d-block">
                  Follow
                </button>
              </div>
              <img src={iconDrop} width="35" height="35" className="" alt="" />
              <span id="profile-page-drops" className="ml-1">
                {this.state.drops}
              </span>

              <img src={iconSubs} width="35" height="35" className="ml-5" alt="" />
              <span id="profile-page-subs" className="ml-1">
                {this.state.followers}
              </span>
            </div>
            <div className="col">
              <div id="profile-page-messages" className="col-sm-7" />
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
