import { drizzleConnect } from 'drizzle-react'
import CommentForm from './CommentForm'
import { commentMessage } from './CommentFormActions'

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.user.data.name,
    imgUrl: state.user.data.imgUrl,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    commentMessage: (parent, username, imgUrl, message) => {
      dispatch(commentMessage(parent, username, imgUrl, message))
    },
  }
}

const CommentFormContainer = drizzleConnect(CommentForm, mapStateToProps, mapDispatchToProps)

export default CommentFormContainer
