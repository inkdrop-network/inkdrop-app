import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { CardBody } from 'reactstrap'
import Moment from 'react-moment'

class CommentItem extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    this.state = {
      comment: {
        content: '',
        username: '',
        timestamp: Date.now(),
        timetolive: Date.now(),
        likes: '',
        drops: '',
        userUrl: '', //`https://gateway.ipfs.io/ipfs/${''}`,
        userAdr: '',
        id: '',
        fromBlockchain: false,
        initialized: false,
      },
    }

    this.dataKey = this.contracts.InkDrop.methods.getComment.cacheCall(this.props.commentId)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.dataKey in this.props.InkDrop.getComment &&
      !(this.dataKey in prevProps.InkDrop.getComment)
    ) {
      this.updateComment()
    }

    if (this.userDataKey in this.props.InkDrop.getUser && !this.state.comment.initialized) {
      this.updateUser()
    }
  }

  updateComment() {
    let tmpComm = this.props.InkDrop.getComment[this.dataKey].value
    this.userDataKey = this.contracts.InkDrop.methods.getUser.cacheCall(tmpComm.writtenBy)
    let comment = {
      content: tmpComm.content,
      username: '',
      timestamp: new Date(tmpComm.timestamp * 1000),
      timetolive: new Date(tmpComm.timetolive * 1000),
      likes: parseInt(tmpComm.likes, 10),
      drops: parseInt(tmpComm.drops, 10) / 100,
      userUrl: '',
      userAdr: tmpComm.writtenBy,
      id: this.props.commentId,
      fromBlockchain: true,
    }
    this.setState({ comment: comment })
  }

  updateUser() {
    let tmpComm = this.props.InkDrop.getComment[this.dataKey].value
    let tmpUser = this.props.InkDrop.getUser[this.userDataKey].value
    let comment = {
      content: tmpComm.content,
      username: this.context.drizzle.web3.utils.toUtf8(tmpUser.username),
      timestamp: new Date(tmpComm.timestamp * 1000),
      timetolive: new Date(tmpComm.timetolive * 1000),
      likes: parseInt(tmpComm.likes, 10),
      drops: parseInt(tmpComm.drops, 10) / 100,
      userUrl: `https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
      userAdr: tmpComm.writtenBy,
      id: this.props.commentId,
      fromBlockchain: true,
      initialized: true,
    }
    this.setState({ comment: comment })
  }

  render() {
    // render only comments that are fully fetched from the blockchain and not only initial comments' ids
    return (
      <CardBody key={this.props.commentId} className="comment-card mb-2">
        <div className="d-flex flex-row">
          <img
            className="mr-2 profile-img"
            src={this.state.comment.userUrl || 'http://via.placeholder.com/50/85bd3e/85bd3e'}
            alt="profile"
          />
          <div>
            <Link to={`/user/${this.state.comment.userAdr}`} className="">
              <strong className="align-top d-block card-username">
                c/{this.state.comment.username}
              </strong>
            </Link>
            <span className="card-message-time">
              <Moment fromNow>{this.state.comment.timestamp}</Moment>
            </span>
          </div>
        </div>
        <div className="pt-2">{this.state.comment.content}</div>
      </CardBody>
    )
  }
}

CommentItem.contextTypes = {
  drizzle: PropTypes.object,
}

export default CommentItem
