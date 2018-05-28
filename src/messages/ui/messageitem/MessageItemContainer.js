import { connect } from 'react-redux'
import MessageItem from './MessageItem'
import { likeMessage, dropMessage } from './MessageItemActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    likeMessage: (id, likes) => {
      dispatch(likeMessage(id, likes))
    },
    dropMessage: (id, dropsAdd, dropsTotal) => {
      dispatch(dropMessage(id, dropsAdd, dropsTotal))
    },
  }
}

const MessageItemContainer = connect(mapStateToProps, mapDispatchToProps)(MessageItem)

export default MessageItemContainer
