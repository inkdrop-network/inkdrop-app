import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'
import { SIGNUP_REQUESTED } from '../../userSagas'

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    signup: state.user.signup,
    error: state.user.error,
    errorMessage: state.user.errorMessage,
    loading: state.user.loading,
    txMessage: state.user.txMessage,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignupUser: (user, buffer) => {
      dispatch({ type: SIGNUP_REQUESTED, user, buffer })
    },
    // onIpfsUpload: buffer => {
    //   dispatch({ type: IPFS_UPLOAD_REQUESTED, buffer })
    // },
  }
}

const SignUpFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm)

export default SignUpFormContainer
