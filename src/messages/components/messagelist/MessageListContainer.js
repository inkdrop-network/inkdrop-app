import { connect } from 'react-redux'
import MessageList from './MessageList'

const mapStateToProps = (state, ownProps) => {
  return {
    messages: state.messages.data,
    initialized: state.messages.initialized,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMessages: () => {
      dispatch({ type: 'MESSAGES_FETCH_REQUESTED' })
    },
  }
}

const MessageListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList)

export default MessageListContainer
