import React, { Component } from 'react'
import { browserHistory } from 'react-router'

class LogoutButton extends Component {
	handleLogout(event) {
		event.preventDefault()
		this.props.onLogoutUser()
		browserHistory.push('/')
	}

	render() {
		return (
			<li className="nav-item">
				<a href="#" className="" onClick={event => this.handleLogout(event)}>
					Logout
				</a>
			</li>
		)
	}
}

export default LogoutButton
