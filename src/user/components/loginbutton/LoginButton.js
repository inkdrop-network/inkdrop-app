import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class LoginButton extends PureComponent {
  constructor(props) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin(event) {
    event.preventDefault()
    let user = {
      address: this.props.accounts[0],
    }
    this.props.onLoginUser(user)
  }

  render() {
    return (
      <li className="nav-item mr-4">
        <a href="#" className="" onClick={this.handleLogin}>
          Login
        </a>
      </li>
    )
  }
}

LoginButton.propTypes = {
  accounts: PropTypes.object,
}

export default LoginButton
