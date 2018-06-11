import { drizzleConnect } from 'drizzle-react'
import MessageItem from './MessageItem'

const mapStateToProps = (state, ownProps) => {
  return {
    InkDrop: state.contracts.InkDrop,
    user: state.user.data,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMessageGot: message => {
      dispatch({ type: 'MESSAGE_FETCH_REQUESTED', payload: message })
    },
    onMessageDrop: drops => {
      dispatch({ type: 'MESSAGE_DROP_REQUESTED', payload: drops })
    },
  }
}

const MessageItemContainer = drizzleConnect(MessageItem, mapStateToProps, mapDispatchToProps)

export default MessageItemContainer
