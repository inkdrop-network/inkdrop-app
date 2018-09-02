import { connect } from 'react-redux'
import MessageItem from './MessageItem'
import { MESSAGE_DROP_REQUESTED } from '../../messagesSagas'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMessageDrop: (msg, drops) => {
      dispatch({ type: MESSAGE_DROP_REQUESTED, msg, drops })
    },
    // onMessageLike: msg => {
    //   dispatch({ type: MESSAGE_LIKE_REQUESTED, msg })
    // },
  }
}

const MessageItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageItem)

export default MessageItemContainer
