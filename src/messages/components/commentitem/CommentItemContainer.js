import { connect } from 'react-redux'
import CommentItem from './CommentItem'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

const CommentItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentItem)

export default CommentItemContainer
