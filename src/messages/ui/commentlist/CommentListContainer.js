import { drizzleConnect } from 'drizzle-react'
import CommentList from './CommentList'

const mapStateToProps = (state, ownProps) => {
  return {
    comments: state.messages.commentsdata,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getComments: (parent, comments) => {
      dispatch()
    },
  }
}

const CommentListContainer = drizzleConnect(CommentList, mapStateToProps, mapDispatchToProps)

export default CommentListContainer
