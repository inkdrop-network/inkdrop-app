import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Card, CardBody, CardFooter } from 'reactstrap'
import Moment from 'react-moment'

import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class CommentItem extends Component {
  renderTxStatus() {
    if (!this.props.comment.fromBlockchain) {
      return (
        <CardFooter className="tx-card py-0">
          <div className="row">
            <div className="col">
              <img
                className="mr-2 my-1"
                src={loadingSpinner}
                alt="profile"
                width="20"
                height="20"
              />
              <small className="text-muted">Submitting to blockchain</small>
            </div>
          </div>
        </CardFooter>
      )
    }
  }

  render() {
    return (
      <Card
        key={this.props.comment.id}
        className={`comment-card mb-2 ${this.props.comment.fromBlockchain ? '' : 'muted'}`}>
        <CardBody>
          <div className="d-flex flex-row">
            <img
              className="mr-2 profile-img"
              src={this.props.comment.userUrl || 'http://via.placeholder.com/50/85bd3e/85bd3e'}
              alt="profile"
            />
            <div>
              <Link to={`/user/${this.props.comment.userAdr}`} className="">
                <strong className="align-top d-block card-username">
                  @{this.props.comment.username}
                </strong>
              </Link>
              <span className="card-message-time">
                <Moment fromNow>{this.props.comment.timestamp}</Moment>
              </span>
            </div>
          </div>
          <div className="pt-2">{this.props.comment.content}</div>
        </CardBody>
        {this.renderTxStatus()}
      </Card>
    )
  }
}

CommentItem.propTypes = {
  comment: PropTypes.object,
}

export default CommentItem
