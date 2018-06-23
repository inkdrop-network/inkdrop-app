import { drizzleConnect } from 'drizzle-react'
import MessageList from './MessageList'

const mapStateToProps = (state, ownProps) => {
  return {
    messages: state.messages.data,
    initialized: state.messages.initialized,
    accounts: state.accounts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMessages: () => {
      dispatch({ type: 'MESSAGES_FETCH_REQUESTED' })
    },
    // onMessageCountGot: count => {
    //   dispatch({ type: 'MESSAGE_COUNT_REQUESTED', payload: count })
    // },

    // onMessageTxSuccess: msg => {
    //   dispatch({ type: 'MESSAGE_TX_REQUESTED', payload: msg })
    // },
  }
}

const MessageListContainer = drizzleConnect(MessageList, mapStateToProps, mapDispatchToProps)

export default MessageListContainer
