// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import LoginButton from './LoginButton'

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoginUser: user => {
      dispatch({ type: 'LOGIN_REQUESTED', user })
    },
  }
}

const LoginButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton)

export default LoginButtonContainer
