import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class LogoutButton extends PureComponent {
  constructor(props) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout(event) {
    event.preventDefault()
    this.props.onLogoutUser()
  }

  render() {
    return (
      <li className="nav-item">
        <a href="" className="" onClick={this.handleLogout}>
          Logout
        </a>
      </li>
    )
  }
}

LogoutButton.propTypes = {
  onLogoutUser: PropTypes.func,
}

export default LogoutButton
