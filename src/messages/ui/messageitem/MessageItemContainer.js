import { drizzleConnect } from 'drizzle-react'
import MessageItem from './MessageItem'

const mapStateToProps = (state, ownProps) => {
	return {
		InkDrop: state.contracts.InkDrop,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onMessageGot: message => {
			dispatch({ type: 'MESSAGE_FETCH_REQUESTED', payload: message })
		},
	}
}

const MessageItemContainer = drizzleConnect(MessageItem, mapStateToProps, mapDispatchToProps)

export default MessageItemContainer
