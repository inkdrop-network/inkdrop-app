import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Linkify from 'react-linkify'
import { Card, CardBody, CardFooter } from 'reactstrap'
import Moment from 'react-moment'

import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class CommentItem extends PureComponent {
  renderTxStatus() {
    if (!this.props.comment.fromBlockchain) {
      let message = ''
      let cls = 'text-muted'
      if (this.props.comment.error) {
        message = this.props.comment.error
        cls = 'text-danger'
      } else if (this.props.comment.sendingMessage) {
        message = this.props.comment.sendingMessage
      }
      return (
        <CardFooter className="tx-card py-0">
          <div className="row">
            <div className="col">
              {!this.props.comment.error && (
                <img
                  className="mr-2 my-1"
                  src={loadingSpinner}
                  alt="loading"
                  width="20"
                  height="20"
                />
              )}
              <small className={cls}>{message}</small>
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
          <div className="card-user d-flex flex-row">
            <img
              className="mr-2 profile-img"
              src={this.props.comment.userUrl || 'https://via.placeholder.com/50/85bd3e/85bd3e'}
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
          <div className="card-content pt-2">
            <Linkify properties={{ target: '_blank' }}>{this.props.comment.content}</Linkify>
          </div>
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
