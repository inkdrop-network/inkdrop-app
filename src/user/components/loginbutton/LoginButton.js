import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

class LoginButton extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    // this.userDataKey = this.contracts.InkDrop.methods.getUser.cacheCall(this.props.accounts[0])
  }

  async handleLogin(event) {
    event.preventDefault()

    let isUser = await this.contracts.InkDrop.methods.isUser(this.props.accounts[0]).call()

    if (isUser) {
      // // If the data is here, get it and display it
      let user = await this.contracts.InkDrop.methods.getUser(this.props.accounts[0]).call()
      let userDrops = parseInt(user.drops, 10) >= 0 ? parseInt(user.drops, 10) / 100 : 0
      let newUser = {
        name: this.context.drizzle.web3.utils.toUtf8(user.username),
        bio: user.bio,
        drops: userDrops,
        ipfsHash: user.ipfsHash,
        imgUrl: `https://gateway.ipfs.io/ipfs/${user.ipfsHash}`,
        followers: parseInt(user.followers, 10),
      }
      // trigger saga
      this.props.onLoginUser(newUser)

      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      var currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      return browserHistory.push('/newsfeed')
    } else {
      return browserHistory.push('/signup')
    }
  }

  render() {
    return (
      <li className="nav-item mr-4">
        <a href="#" className="" onClick={event => this.handleLogin(event)}>
          Login
        </a>
      </li>
    )
  }
}

LoginButton.contextTypes = {
  drizzle: PropTypes.object,
}

export default LoginButton
