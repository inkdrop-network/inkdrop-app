import { drizzleConnect } from 'drizzle-react'
import MessageList from './MessageList'
import { getMessages } from './MessageListActions'

const mapStateToProps = (state, ownProps) => {
  return {
    messages: state.messages.data || [],
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllMessages: event => {
      dispatch(getMessages())
    },
  }
}

const MessageListContainer = drizzleConnect(MessageList, mapStateToProps, mapDispatchToProps)

export default MessageListContainer
