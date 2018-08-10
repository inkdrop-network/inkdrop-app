// import { connect } from 'react-redux'
import { drizzleConnect } from 'drizzle-react'
import MessageForm from './MessageForm'
import { MESSAGE_REQUESTED } from '../../messagesSagas'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    accounts: state.accounts,
    messages: state.messages.data,
    messages_total: state.messages.total,
    balance: state.accountBalances[state.accounts[0]],
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCreateMessage: msg => {
      dispatch({ type: MESSAGE_REQUESTED, msg })
    },
  }
}

const MessageFormContainer = drizzleConnect(MessageForm, mapStateToProps, mapDispatchToProps)

export default MessageFormContainer
