import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CommentItemContainer from '../commentitem/CommentItemContainer'
import CommentFormContainer from '../commentform/CommentFormContainer'

class CommentList extends Component {
  render() {
    return (
      <div className="comments">
        {this.props.message.comments.map((comment, index) => (
          <CommentItemContainer comment={comment} key={index} />
        ))}

        <CommentFormContainer message={this.props.message} />
      </div>
    )
  }
}

CommentList.propTypes = {
  message: PropTypes.object,
}

export default CommentList
