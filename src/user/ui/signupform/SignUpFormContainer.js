import { drizzleConnect } from 'drizzle-react'
import SignUpForm from './SignUpForm'

const mapStateToProps = (state, ownProps) => {
	return {
		accounts: state.accounts,
		InkDrop: state.contracts.InkDrop,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSignupUser: user => {
			dispatch({ type: 'SIGNUP_REQUESTED', payload: user })
		},
	}
}

const SignUpFormContainer = drizzleConnect(SignUpForm, mapStateToProps, mapDispatchToProps)

export default SignUpFormContainer
