import React, { Component } from 'react'
import { Link } from 'react-router'
import { Card, CardBody, CardFooter, Form, FormGroup, Button, Input } from 'reactstrap'
import Moment from 'react-moment'

class MessageItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: this.props.username,
      newcomment: '',
      comments: this.props.message.comments || [],
      showComments: false
    }

    this.handleComment = this.handleComment.bind(this)
    this.commentMessage = this.commentMessage.bind(this)
    this.toggleComments = this.toggleComments.bind(this)
  }

  componentDidMount() {
    // Fetch comments only for messages that are already on the blockchain and not virutal local messages -------------------
    if (this.props.message.fromBlockchain) {
      this.props.getComments(this.props.message.id, this.props.message.comments)
    }
  }

  dropMessage(id, dropsTotal) {
    this.props.dropMessage(id, 1, dropsTotal)
  }

  likeMessage(id, likes) {
    this.props.likeMessage(id, likes)
  }

  handleComment(event) {
    this.setState({ newcomment: event.target.value })
  }

  commentMessage(event) {
    event.preventDefault()
    console.log('Comment message: ' + this.props.message.id + ' - ' + this.state.newcomment)
    this.props.commentMessage(this.props.message.id, this.state.username, this.state.newcomment)
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
                <img
                  src="icons/icon-inkdrop-dark.svg"
                  width="20"
                  height="20"
                  className="drops"
                  alt=""
                />
                <span className="drop-number icon-number ml-1">{msg.drops}</span>
              </div>
            </div>
            <div className="col text-center">
              <div
                className="like-message-button mx-auto"
                onClick={() => this.likeMessage(msg.id, msg.likes)}>
                <img src="icons/icon-like.svg" width="20" height="20" className="" alt="likes" />
                <span className="like-number icon-number ml-1">{msg.likes}</span>
              </div>
            </div>
            <div className="col">
              <div
                className="comment-message-button float-right"
                onClick={() => this.toggleComments()}>
                <img
                  src="icons/icon-comments.svg"
                  width="20"
                  height="20"
                  className=""
                  alt="comments"
                />
                <span className={`comment-number icon-number ml-1 ${commentsNrClass}`}>
                  {msg.comments.length}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className={`comments-card ${commentsClass}`}>
          {this.props.message.comments.map(comment => (
            <CardBody key={`com-${comment.id}`} className="comment-card mb-2">
              <div className="d-flex flex-row">
                <img
                  className="mr-2 profile-img"
                  src={comment.userUrl || 'http://via.placeholder.com/50/85bd3e/85bd3e'}
                  alt="profile"
                />
                <div>
                  <Link to={`/user/${comment.userAdr}`} className="">
                    <strong className="align-top d-block card-username">
                      c/{comment.username}
                    </strong>
                  </Link>
                  <span className="card-message-time">
                    <Moment fromNow>{comment.timestamp}</Moment>
                  </span>
                </div>
              </div>
              <div className="pt-2">{comment.content}</div>
            </CardBody>
          ))}

          <Form onSubmit={this.commentMessage}>
            <FormGroup>
              <Input
                value={this.state.newcomment}
                onChange={this.handleComment}
                type="textarea"
                name="comment"
                rows="2"
                placeholder="Your comment"
              />
            </FormGroup>
            <Button color="green">Comment</Button>
          </Form>
        </CardFooter>
      </Card>
    )
  }
}

export default MessageItem
