import { drizzleConnect } from 'drizzle-react'
import CommentList from './CommentList'

const mapStateToProps = (state, ownProps) => {
  return {
    comments: state.messages.commentsdata,
    InkDrop: state.contracts.InkDrop,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCommentTxSuccess: comment => {
      dispatch({ type: 'COMMENT_TX_REQUESTED', payload: comment })
    },
  }
}

const CommentListContainer = drizzleConnect(CommentList, mapStateToProps, mapDispatchToProps)

export default CommentListContainer
