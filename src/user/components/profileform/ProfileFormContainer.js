import { connect } from 'react-redux'
import ProfileForm from './ProfileForm'
import { USERUPDATE_REQUESTED } from '../../userSagas'

const mapStateToProps = state => {
  return {
    user: state.user.data,
    accounts: state.accounts,
    error: state.user.error,
    errorMessage: state.user.errorMessage,
    loading: state.user.loading,
    txMessage: state.user.txMessage,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateUser: (user, buffer) => {
      dispatch({ type: USERUPDATE_REQUESTED, user, buffer })
    },
  }
}

const ProfileFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileForm)

export default ProfileFormContainer
