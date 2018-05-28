import React, { Component } from 'react'
import { Link } from 'react-router'
import { CardBody } from 'reactstrap'
import Moment from 'react-moment'

class CommentItem extends Component {
  render() {
    // render only comments that are fully fetched from the blockchain and not only initial comments' ids
    return (
      <CardBody key={this.props.comment.id} className="comment-card mb-2">
        <div className="d-flex flex-row">
          <img
            className="mr-2 profile-img"
            src={this.props.comment.userUrl || 'http://via.placeholder.com/50/85bd3e/85bd3e'}
            alt="profile"
          />
          <div>
            <Link to={`/user/${this.props.comment.userAdr}`} className="">
              <strong className="align-top d-block card-username">
                c/{this.props.comment.username}
              </strong>
            </Link>
            <span className="card-message-time">
              <Moment fromNow>{this.props.comment.timestamp}</Moment>
            </span>
          </div>
        </div>
        <div className="pt-2">{this.props.comment.content}</div>
      </CardBody>
    )
  }
}

export default CommentItem
