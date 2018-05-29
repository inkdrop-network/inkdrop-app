import { drizzleConnect } from 'drizzle-react'
import CommentList from './CommentList'
import { getComments } from './CommentListActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    getComments: (parent, comments) => {
      dispatch(getComments(parent, comments))
    },
  }
}

const CommentListContainer = drizzleConnect(CommentList, mapStateToProps, mapDispatchToProps)

export default CommentListContainer
