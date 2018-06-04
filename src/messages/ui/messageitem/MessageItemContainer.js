import { drizzleConnect } from 'drizzle-react'
import MessageItem from './MessageItem'

const mapStateToProps = (state, ownProps) => {
	return {
		InkDrop: state.contracts.InkDrop,
	}
}

const MessageItemContainer = drizzleConnect(MessageItem, mapStateToProps)

export default MessageItemContainer
