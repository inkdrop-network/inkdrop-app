import { connect } from 'react-redux'
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

const CommentFormContainer = connect(mapStateToProps, mapDispatchToProps)(CommentForm)

export default CommentFormContainer
