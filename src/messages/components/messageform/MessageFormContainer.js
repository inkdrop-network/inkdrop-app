import { drizzleConnect } from 'drizzle-react'
import MessageForm from './MessageForm'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    accounts: state.accounts,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
    messages: state.messages.data,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCreateMessage: message => {
      dispatch({ type: 'MESSAGE_REQUESTED', payload: message })
    },
    onMessageSaga: (fxn, msg) => {
      dispatch({ type: 'MESSAGE_REQUESTED_S', fxn, msg })
    },
  }
}

const MessageFormContainer = drizzleConnect(MessageForm, mapStateToProps, mapDispatchToProps)

export default MessageFormContainer
