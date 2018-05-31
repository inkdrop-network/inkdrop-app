import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

class LoginButton extends Component {
	constructor(props, context) {
		super(props)
		this.contracts = context.drizzle.contracts

		this.userDataKey = this.contracts.InkDrop.methods.getUser.cacheCall(this.props.accounts[0])
	}

	handleLogin(event) {
		event.preventDefault()

		if (this.userDataKey in this.props.InkDrop.getUser) {
			// // If the data is here, get it and display it
			let user = this.props.InkDrop.getUser[this.userDataKey].value
			let newUser = {
				name: this.context.drizzle.web3.utils.toUtf8(user[0]),
				bio: user[1],
				drops: parseInt(user[2], 10),
				ipfsHash: user[3],
				imgUrl: `https://gateway.ipfs.io/ipfs/${user[3]}`,
				followers: parseInt(user[4], 10),
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
