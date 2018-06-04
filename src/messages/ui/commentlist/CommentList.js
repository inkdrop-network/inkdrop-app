import React, { Component } from 'react'
import CommentItem from './CommentItem'
import CommentFormContainer from '../commentform/CommentFormContainer'

class CommentList extends Component {
  componentDidMount() {
    // Fetch comments only for messages that are already on the blockchain and not virutal local messages
    // if (this.props.message.fromBlockchain) {
    //   this.props.getComments(this.props.message.id, this.props.message.comments)
    // }
  }

  render() {
    if (this.props.message.comments.length > 0) {
      return (
        <div className="comments">
          {this.props.message.comments.map((comment, index) => (
            <CommentItem comment={comment} key={index} />
          ))}
          <CommentFormContainer message={this.props.message} />
        </div>
      )
    }
  }
}

export default CommentList
