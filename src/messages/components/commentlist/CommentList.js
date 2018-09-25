import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import CommentItem from '../commentitem/CommentItem'
import CommentFormContainer from '../commentform/CommentFormContainer'

class CommentList extends PureComponent {
  render() {
    return (
      <div className="container-fluid">
        <div className="row mb-5">
          <CommentFormContainer message={this.props.message} />
        </div>
        <div className="comments row">
          {this.props.message.comments.map((comment, index) => (
            <div className="w-100" key={index}>
              <CommentItem comment={comment} />
              {this.props.message.comments.length - 1 > index && <hr className="w-100 mb-4" />}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

CommentList.propTypes = {
  message: PropTypes.object,
}

export default CommentList
