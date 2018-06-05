import { drizzleConnect } from 'drizzle-react'
import MessageList from './MessageList'

const mapStateToProps = (state, ownProps) => {
	return {
		messages: state.messages.data,
		initialized: state.messages.initialized,
		count: state.messages.count,
		accounts: state.accounts,
		InkDrop: state.contracts.InkDrop,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onMessageCountGot: count => {
			dispatch({ type: 'MESSAGE_COUNT_REQUESTED', payload: count })
		},
	}
}

const MessageListContainer = drizzleConnect(MessageList, mapStateToProps, mapDispatchToProps)

export default MessageListContainer
