import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import CommentItem from '../commentitem/CommentItem'
import CommentFormContainer from '../commentform/CommentFormContainer'

class CommentList extends PureComponent {
  render() {
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

CommentList.propTypes = {
  message: PropTypes.object,
}

export default CommentList
