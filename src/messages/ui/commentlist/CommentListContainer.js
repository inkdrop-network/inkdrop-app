import { connect } from 'react-redux'
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

const CommentListContainer = connect(mapStateToProps, mapDispatchToProps)(CommentList)

export default CommentListContainer
