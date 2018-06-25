import { connect } from 'react-redux'
import MessageForm from './MessageForm'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    accounts: state.accounts,
    messages: state.messages.data,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCreateMessage: msg => {
      dispatch({ type: 'MESSAGE_REQUESTED', msg })
    },
  }
}

const MessageFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageForm)

export default MessageFormContainer
