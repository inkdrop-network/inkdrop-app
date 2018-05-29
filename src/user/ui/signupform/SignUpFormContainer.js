import { drizzleConnect } from 'drizzle-react'
import SignUpForm from './SignUpForm'
// import { signedUpUser, signUpUser } from './SignUpFormActions'

const mapStateToProps = (state, ownProps) => {
	return {
		accounts: state.accounts,
		InkDrop: state.contracts.InkDrop,
	}
}

// const mapDispatchToProps = dispatch => {
// 	return {
// 		onSignUpFormSubmit: (name, bio, buffer) => {
// 			dispatch(signUpUser(name, bio, buffer))
// 		},
// 		signedUpUser: () => {
// 			dispatch(signedUpUser())
// 		},
// 	}
// }

const SignUpFormContainer = drizzleConnect(SignUpForm, mapStateToProps)

export default SignUpFormContainer
