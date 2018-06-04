import { drizzleConnect } from 'drizzle-react'
import MessageList from './MessageList'

const mapStateToProps = (state, ownProps) => {
	return {
		messages: state.messages.data || [],
		accounts: state.accounts,
		InkDrop: state.contracts.InkDrop,
	}
}

const MessageListContainer = drizzleConnect(MessageList, mapStateToProps)

export default MessageListContainer
