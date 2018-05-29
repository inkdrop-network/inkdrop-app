import { drizzleConnect } from 'drizzle-react'
import LoginButton from './LoginButton'
import { loginUser, loggedInUser } from './LoginButtonActions'

const mapStateToProps = (state, ownProps) => {
	return {
		accounts: state.accounts,
		InkDrop: state.contracts.InkDrop,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onLoginUserClick: event => {
			event.preventDefault()

			dispatch(loginUser())
		},
		loggedInUser: user => {
			dispatch(loggedInUser(user))
		},
	}
}

const LoginButtonContainer = drizzleConnect(LoginButton, mapStateToProps, mapDispatchToProps)

export default LoginButtonContainer
