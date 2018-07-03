import { connect } from 'react-redux'
import UserPage from './UserPage'
import { USER_MESSAGES_FETCH_REQUESTED, USER_MESSAGES_RESET_REQUESTED } from '../../messagesSagas'

const mapStateToProps = (state, ownProps) => {
  return {
    address: ownProps.params.id,
    user: state.messages.userpage_user,
    messages: state.messages.userpage_messages,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUserMessages: address => {
      dispatch({ type: USER_MESSAGES_FETCH_REQUESTED, address })
    },
    resetUserMessages: () => {
      dispatch({ type: USER_MESSAGES_RESET_REQUESTED })
    },
  }
}

const UserPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage)

export default UserPageContainer
