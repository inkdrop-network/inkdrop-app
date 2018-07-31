import { connect } from 'react-redux'
import MessageList from './MessageList'
import { MESSAGES_FETCH_REQUESTED } from '../../messagesSagas'

const mapStateToProps = (state, ownProps) => {
  return {
    messages: state.messages.data,
    pagination: state.messages.pagination,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMessages: items => {
      dispatch({ type: MESSAGES_FETCH_REQUESTED, items })
    },
  }
}

const MessageListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList)

export default MessageListContainer
