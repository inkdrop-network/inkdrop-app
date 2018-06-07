import { drizzleConnect } from 'drizzle-react'
import CommentForm from './CommentForm'
import { commentMessage } from './CommentFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    accounts: state.accounts,
    InkDrop: state.contracts.InkDrop,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    commentMessage: (parent, username, imgUrl, message) => {
      dispatch(commentMessage(parent, username, imgUrl, message))
    },
  }
}

const CommentFormContainer = drizzleConnect(CommentForm, mapStateToProps)

export default CommentFormContainer
