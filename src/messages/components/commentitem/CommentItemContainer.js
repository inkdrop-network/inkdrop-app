import { drizzleConnect } from 'drizzle-react'
import CommentItem from './CommentItem'

const mapStateToProps = (state, ownProps) => {
  return {
    InkDrop: state.contracts.InkDrop,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMessageCountGot: count => {
      dispatch({ type: 'MESSAGE_COUNT_REQUESTED', payload: count })
    },

    onMessageTxSuccess: msg => {
      dispatch({ type: 'MESSAGE_TX_REQUESTED', payload: msg })
    },
  }
}

const CommentItemContainer = drizzleConnect(CommentItem, mapStateToProps, mapDispatchToProps)

export default CommentItemContainer
