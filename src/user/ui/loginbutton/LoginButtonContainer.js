import { drizzleConnect } from 'drizzle-react'
import LoginButton from './LoginButton'

const mapStateToProps = (state, ownProps) => {
	return {
		accounts: state.accounts,
		InkDrop: state.contracts.InkDrop,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onLoginUser: user => {
			dispatch({ type: 'LOGIN_REQUESTED', payload: user })
		},
	}
}

const LoginButtonContainer = drizzleConnect(LoginButton, mapStateToProps, mapDispatchToProps)

export default LoginButtonContainer
