import { connect } from 'react-redux'
import MessageForm from './MessageForm'
import { postMessage } from './MessageFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.user.data.name,
    imgUrl: state.user.data.imgUrl,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMessageSubmit: (content, username, imgUrl) => {
      dispatch(postMessage(content, username, imgUrl))
    },
  }
}

const MessageFormContainer = connect(mapStateToProps, mapDispatchToProps)(MessageForm)

export default MessageFormContainer
