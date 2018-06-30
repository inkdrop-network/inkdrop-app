import React, { PureComponent } from 'react'

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
        <a href="#" className="" onClick={this.handleLogout}>
          Logout
        </a>
      </li>
    )
  }
}

export default LogoutButton
