import React, { Component } from 'react'
import { Link } from 'react-router'
import { Card, CardBody, CardFooter } from 'reactstrap'
import Moment from 'react-moment'
import CommentListContainer from '../commentlist/CommentListContainer'

// Images
import inkdropDark from '../../../../public/icons/icon-inkdrop-dark.svg'
import iconLike from '../../../../public/icons/icon-like.svg'
import iconComment from '../../../../public/icons/icon-comments.svg'

class MessageItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      comments: this.props.message.comments || [],
      showComments: false,
    }

    this.toggleComments = this.toggleComments.bind(this)
  }

  dropMessage(id, dropsTotal) {
    this.props.dropMessage(id, 1, dropsTotal)
  }

  likeMessage(id, likes) {
    this.props.likeMessage(id, likes)
  }

  getClass() {
    if (this.state.showComments === false) return 'd-none'
    else return ''
  }

  getNrClass() {
    if (this.state.showComments === true) return 'open'
    else return ''
  }

  toggleComments() {
    this.setState(prevState => {
      return { showComments: !prevState.showComments }
    })
  }

  render() {
    let commentsClass = this.getClass()
    let commentsNrClass = this.getNrClass()
    let msg = this.props.message
    return (
      <Card className="message-card mb-4">
        <CardBody className="d-flex flex-row pb-2">
          <img
            className="mr-2 profile-img"
            src={msg.userUrl || 'http://via.placeholder.com/50/85bd3e/85bd3e'}
            alt="profile"
          />
          <div>
            <Link to={`/user/${msg.userAdr}`} className="">
              <strong className="align-top d-block card-username">c/{msg.username}</strong>
            </Link>
            <span className="card-message-time">
              <Moment fromNow>{msg.timestamp}</Moment>
            </span>
          </div>
        </CardBody>
        <CardBody className="py-2">{msg.content}</CardBody>
        <CardBody className="pt-2">
          <div className="row">
            <div className="col">
              <div
                className="drop-message-button float-left"
                onClick={() => this.dropMessage(msg.id, msg.drops)}>
                <img src={inkdropDark} width="20" height="20" className="drops" alt="" />
                <span className="drop-number icon-number ml-1">{msg.drops}</span>
              </div>
            </div>
            <div className="col text-center">
              <div
                className="like-message-button mx-auto"
                onClick={() => this.likeMessage(msg.id, msg.likes)}>
                <img src={iconLike} width="20" height="20" className="" alt="likes" />
                <span className="like-number icon-number ml-1">{msg.likes}</span>
              </div>
            </div>
            <div className="col">
              <div
                className="comment-message-button float-right"
                onClick={() => this.toggleComments()}>
                <img src={iconComment} width="20" height="20" className="" alt="comments" />
                <span className={`comment-number icon-number ml-1 ${commentsNrClass}`}>
                  {msg.comments.length}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className={`comments-card ${commentsClass}`}>
          <CommentListContainer message={msg} />
        </CardFooter>
      </Card>
    )
  }
}

export default MessageItem
