import React, { Component } from 'react'
import { browserHistory } from 'react-router'

class LogoutButton extends Component {
  constructor(props) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout(event) {
    event.preventDefault()
    this.props.onLogoutUser()
    browserHistory.push('/')
  }

  render() {
    return (
      <li className="nav-item">
        <a href="#" className="" onClick={this.handleLogout}>
          Logout
        </a>
      </li>
    )
  }
}

export default LogoutButton
