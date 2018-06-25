// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
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
      dispatch({ type: 'COMMENT_REQUESTED', comment })
    },
  }
}

const CommentFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentForm)

export default CommentFormContainer
