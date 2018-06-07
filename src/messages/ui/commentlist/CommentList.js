import React, { Component } from 'react'
import CommentItemContainer from '../commentitem/CommentItemContainer'
import CommentFormContainer from '../commentform/CommentFormContainer'

class CommentList extends Component {
  render() {
    // TODO: render also comments from store here
    // like in MessageList
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
