import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { NavItem } from 'reactstrap'

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
      <NavItem className="mr-4">
        <a href="" onClick={this.handleLogin}>
          Login
        </a>
      </NavItem>
    )
  }
}

LoginButton.propTypes = {
  accounts: PropTypes.object,
  onLoginUser: PropTypes.func,
}

export default LoginButton
