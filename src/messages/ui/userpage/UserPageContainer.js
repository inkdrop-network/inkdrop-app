import { connect } from 'react-redux'
import UserPage from './UserPage'
import { getUserMessages, resetUserMessages, getUserInfo } from './UserPageActions'

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.params.id,
    usermessages: state.messages.userdata || [],
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUserMessages: adr => {
      dispatch(getUserMessages(adr))
    },
    resetUserMessages: adr => {
      dispatch(resetUserMessages())
    },
    resetUserInfo: adr => {
      dispatch(getUserInfo(adr))
    },
  }
}

const UserPageContainer = connect(mapStateToProps, mapDispatchToProps)(UserPage)

export default UserPageContainer
