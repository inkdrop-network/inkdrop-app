import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Card, CardBody, CardFooter } from 'reactstrap'
import Moment from 'react-moment'
import CommentListContainer from '../commentlist/CommentListContainer'

// Images
import inkdropDark from '../../../../public/icons/icon-inkdrop-dark.svg'
import iconLike from '../../../../public/icons/icon-like.svg'
import iconComment from '../../../../public/icons/icon-comments.svg'

class MessageItem extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    this.state = {
      comments: [],
      showComments: false,
      message: {
        content: '',
        username: '',
        timestamp: Date.now(),
        timetolive: Date.now(),
        likes: '',
        drops: '',
        userUrl: '', //`https://gateway.ipfs.io/ipfs/${''}`,
        userAdr: '',
        id: '',
        comments: [],
        fromBlockchain: false,
      },
      user: {
        name: '',
        bio: '',
        drops: '',
        ipfsHash: '',
        imgUrl: '',
        followers: '',
      },
    }

    this.contracts.InkDrop.methods
      .getMessage(this.props.msgId)
      .call()
      .then(tmpMsg => {
        this.userDataKey = this.contracts.InkDrop.methods.getUser.cacheCall(tmpMsg.writtenBy)
        let msg = {
          content: tmpMsg.content,
          username: '',
          timestamp: new Date(tmpMsg.timestamp * 1000),
          timetolive: new Date(tmpMsg.timetolive * 1000),
          likes: parseInt(tmpMsg.likes, 10),
          drops: parseInt(tmpMsg.drops, 10) / 100,
          userUrl: '',
          userAdr: tmpMsg.writtenBy,
          id: this.props.msgId,
          comments: tmpMsg.comments.map(function(e) {
            return parseInt(e, 10)
          }),
          fromBlockchain: true,
        }
        this.setState({ message: msg })
      })

    this.toggleComments = this.toggleComments.bind(this)
    this.likeMessage = this.likeMessage.bind(this)
    this.dropMessage = this.dropMessage.bind(this)
  }

  async dropMessage() {
    // TODO: add slider for amount of drops to be submitted
    let newDrops = 1
    try {
      await this.contracts.InkDrop.methods.dropMessage(this.props.msgId, newDrops).send()
      this.setState({
        message: {
          ...this.state.message,
          drops: this.state.message.drops + newDrops,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  async likeMessage() {
    try {
      await this.contracts.InkDrop.methods.likeMessage(this.props.msgId).send()
      this.setState({
        message: {
          ...this.state.message,
          likes: this.state.message.likes + 1,
        },
      })
    } catch (error) {
      console.log(error)
    }
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
    let user = this.state.user
    if (this.userDataKey in this.props.InkDrop.getUser) {
      let tmpUser = this.props.InkDrop.getUser[this.userDataKey].value
      user = {
        name: this.context.drizzle.web3.utils.toUtf8(tmpUser.username),
        bio: tmpUser.bio,
        drops: parseInt(tmpUser.drops, 10) / 100,
        ipfsHash: tmpUser.ipfsHash,
        imgUrl: `https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
        followers: parseInt(tmpUser.followers, 10),
      }
    }

    let msg = this.state.message
    msg.username = user.name
    msg.imgUrl = user.imgUrl

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
              <div className="drop-message-button float-left" onClick={this.dropMessage}>
                <img src={inkdropDark} width="20" height="20" className="drops" alt="" />
                <span className="drop-number icon-number ml-1">{msg.drops}</span>
              </div>
            </div>
            <div className="col text-center">
              <div className="like-message-button mx-auto" onClick={this.likeMessage}>
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
        <CardFooter className={`comments-card ${commentsClass}`} />
      </Card>
    )
  }

  //<CommentListContainer message={msg} />
}

MessageItem.contextTypes = {
  drizzle: PropTypes.object,
}

export default MessageItem
