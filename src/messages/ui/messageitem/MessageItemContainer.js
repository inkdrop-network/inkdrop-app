import { connect } from 'react-redux'
import MessageItem from './MessageItem'
import { likeMessage, dropMessage, commentMessage, getComments } from './MessageItemActions'

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.user.data.name
  }
}

const mapDispatchToProps = dispatch => {
  return {
    likeMessage: (id, likes) => {
      dispatch(likeMessage(id, likes))
    },
    dropMessage: (id, dropsAdd, dropsTotal) => {
      dispatch(dropMessage(id, dropsAdd, dropsTotal))
    },
    commentMessage: (parent, username, message) => {
      dispatch(commentMessage(parent, username, message))
    },
    getComments: (parent, comments) => {
      dispatch(getComments(parent, comments))
    }
  }
}

const MessageItemContainer = connect(mapStateToProps, mapDispatchToProps)(MessageItem)

export default MessageItemContainer
