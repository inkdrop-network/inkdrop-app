import React, { Component } from 'react'
import CommentItemContainer from '../commentitem/CommentItemContainer'
import CommentFormContainer from '../commentform/CommentFormContainer'

class CommentList extends Component {
  render() {
    return (
      <div className="comments">
        {this.props.message.comments.map(commentId => (
          <CommentItemContainer commentId={commentId} key={commentId} />
        ))}
        <CommentFormContainer message={this.props.message} />
      </div>
    )
  }
}

export default CommentList
