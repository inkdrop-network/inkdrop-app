import { connect } from 'react-redux'
import MessageList from './MessageList'
import { getMessages } from './MessageListActions'

const mapStateToProps = (state, ownProps) => {
  return {
    messages: state.messages.data || [],
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllMessages: event => {
      dispatch(getMessages())
    },
  }
}

const MessageListContainer = connect(mapStateToProps, mapDispatchToProps)(MessageList)

export default MessageListContainer
