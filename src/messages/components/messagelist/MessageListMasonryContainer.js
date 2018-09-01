import { connect } from 'react-redux'
import MessageListMasonry from './MessageListMasonry'
import { MESSAGES_FETCH_REQUESTED, MESSAGES_SORT_REQUESTED } from '../../messagesSagas'

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
    sortNewsfeed: () => {
      dispatch({ type: MESSAGES_SORT_REQUESTED })
    },
  }
}

const MessageListMasonryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageListMasonry)

export default MessageListMasonryContainer
