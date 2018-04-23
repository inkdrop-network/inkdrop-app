import { connect } from 'react-redux'
import MessageForm from './MessageForm'
import { postMessage } from './MessageFormActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onMessageSubmit: (content) => {
      event.preventDefault();

      dispatch(postMessage(content))
    }
  }
}

const MessageFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageForm)

export default MessageFormContainer
