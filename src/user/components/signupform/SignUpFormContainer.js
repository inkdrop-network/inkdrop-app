import { drizzleConnect } from 'drizzle-react'
// import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'

const mapStateToProps = (state, ownProps) => {
  return {
    accounts: state.accounts,
    InkDrop: state.contracts.InkDrop,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignupUser: (user, buffer) => {
      dispatch({ type: 'SIGNUP_REQUESTED', user })
    },
    onIpfsUpload: buffer => {
      dispatch({ type: 'IPFS_UPLOAD_REQUESTED', buffer })
    },
  }
}

const SignUpFormContainer = drizzleConnect(SignUpForm, mapStateToProps, mapDispatchToProps)

export default SignUpFormContainer
