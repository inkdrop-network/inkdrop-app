import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'
import { signUpUser } from './SignUpFormActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    onSignUpFormSubmit: (name, bio, buffer) => {
      dispatch(signUpUser(name, bio, buffer))
    },
  }
}

const SignUpFormContainer = connect(mapStateToProps, mapDispatchToProps)(SignUpForm)

export default SignUpFormContainer
