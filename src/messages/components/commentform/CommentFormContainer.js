import { drizzleConnect } from 'drizzle-react'
import CommentForm from './CommentForm'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.data,
    accounts: state.accounts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCommentMessage: comment => {
      dispatch({ type: 'COMMENT_REQUESTED', payload: comment })
    },
  }
}

const CommentFormContainer = drizzleConnect(CommentForm, mapStateToProps, mapDispatchToProps)

export default CommentFormContainer
