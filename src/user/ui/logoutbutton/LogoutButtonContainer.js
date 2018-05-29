import { drizzleConnect } from 'drizzle-react'
import LogoutButton from './LogoutButton'
import { logoutUser } from './LogoutButtonActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    onLogoutUserClick: event => {
      event.preventDefault()

      dispatch(logoutUser())
    },
  }
}

const LogoutButtonContainer = drizzleConnect(LogoutButton, mapStateToProps, mapDispatchToProps)

export default LogoutButtonContainer
