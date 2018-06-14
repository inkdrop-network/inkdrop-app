import { drizzleConnect } from 'drizzle-react'
import UserPage from './UserPage'
import { getUserMessages, resetUserMessages, getUserInfo } from './UserPageActions'

const mapStateToProps = (state, ownProps) => {
  return {
    address: ownProps.params.id,
    InkDrop: state.contracts.InkDrop,
    usermessages: state.messages.userdata,
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

const UserPageContainer = drizzleConnect(UserPage, mapStateToProps)

export default UserPageContainer
