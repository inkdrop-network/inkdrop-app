// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
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

const LoginButtonContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginButton)

export default LoginButtonContainer
