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
import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class MessageItem extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    if (!this.props.cached) {
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
          initialized: false,
        },
      }
      this.dataKey = this.contracts.InkDrop.methods.getMessage.cacheCall(this.props.msgId)

      // Get message info after page changes with props & cacheCalls already in place
      if (this.dataKey in this.props.InkDrop.getMessage) {
        let tmpMsg = this.props.InkDrop.getMessage[this.dataKey].value
        this.userDataKey = this.contracts.InkDrop.methods.getUser.cacheCall(tmpMsg.writtenBy)
        if (this.userDataKey in this.props.InkDrop.getUser) {
          let tmpUser = this.props.InkDrop.getUser[this.userDataKey].value
          this.state = {
            ...this.state,
            message: {
              id: this.props.msgId,
              content: tmpMsg.content,
              // TODO: call this.context.drizzle.web3.utils.toUtf8 to format username
              username: tmpUser.username,
              timestamp: new Date(tmpMsg.timestamp * 1000),
              timetolive: new Date(tmpMsg.timetolive * 1000),
              likes: parseInt(tmpMsg.likes, 10),
              drops: parseInt(tmpMsg.drops, 10) / 100,
              userUrl: `https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
              userAdr: tmpMsg.writtenBy,
              comments: tmpMsg.comments.map(function(e) {
                return parseInt(e, 10)
              }),
              fromBlockchain: true,
              initialized: true,
            },
          }
        }
      }
    } else {
      this.state = {
        comments: [],
        showComments: false,
        message: {
          content: this.props.cachedMsg.content,
          username: this.props.cachedMsg.username,
          timestamp: this.props.cachedMsg.timestamp,
          timetolive: this.props.cachedMsg.timetolive,
          likes: this.props.cachedMsg.likes,
          drops: this.props.cachedMsg.drops,
          userUrl: this.props.cachedMsg.userUrl, //`https://gateway.ipfs.io/ipfs/${''}`,
          userAdr: this.props.cachedMsg.userAdr,
          id: this.props.cachedMsg.id,
          comments: [],
          fromBlockchain: false,
          initialized: false,
        },
      }
    }

    this.toggleComments = this.toggleComments.bind(this)
    this.likeMessage = this.likeMessage.bind(this)
    this.dropMessage = this.dropMessage.bind(this)
  }

  // TODO: check feasibilty of updates. Don update too often!
  // shouldComponentUpdate(nextProps, nextState) {
  // if (this.state.message.fromBlockchain  && this.state.message.initialized) {
  //   return false
  // } else {
  //   return true
  // }
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.cached) {
      if (
        this.dataKey in this.props.InkDrop.getMessage &&
        !(this.dataKey in prevProps.InkDrop.getMessage)
      ) {
        this.updateMessage()
      }

      if (this.userDataKey in this.props.InkDrop.getUser && !this.state.message.initialized) {
        this.updateUser()
      }
      if (
        this.dataKey in this.props.InkDrop.getMessage &&
        this.dataKey in prevProps.InkDrop.getMessage &&
        this.props.InkDrop.getMessage[this.dataKey].value.comments !==
          prevProps.InkDrop.getMessage[this.dataKey].value.comments
      ) {
        this.updateUser()
      }
    }
  }

  updateMessage() {
    let tmpMsg = this.props.InkDrop.getMessage[this.dataKey].value
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
      initialized: false,
    }
    this.setState({ message: msg })
  }

  updateUser() {
    let tmpMsg = this.props.InkDrop.getMessage[this.dataKey].value
    let tmpUser = this.props.InkDrop.getUser[this.userDataKey].value
    let msg = {
      id: this.props.msgId,
      content: tmpMsg.content,
      username: this.context.drizzle.web3.utils.toUtf8(tmpUser.username),
      timestamp: new Date(tmpMsg.timestamp * 1000),
      timetolive: new Date(tmpMsg.timetolive * 1000),
      likes: parseInt(tmpMsg.likes, 10),
      drops: parseInt(tmpMsg.drops, 10) / 100,
      userUrl: `https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
      userAdr: tmpMsg.writtenBy,
      comments: tmpMsg.comments.map(function(e) {
        return parseInt(e, 10)
      }),
      fromBlockchain: true,
      initialized: true,
    }
    // console.log(this.props.msgId)
    // this.props.onMessageGot(msg)
    this.setState({ message: msg })
  }

  async dropMessage() {
    if (!this.props.cached) {
      // TODO: add slider for amount of drops to be submitted
      let newDrops = 1
      if (this.props.user.drops - newDrops < 0) {
        alert('You have not enough funds this transaction.')
      } else {
        try {
          await this.contracts.InkDrop.methods.dropMessage(this.props.msgId, newDrops).send()
          this.setState({
            message: {
              ...this.state.message,
              drops: this.state.message.drops + newDrops,
            },
          })
          this.props.onMessageDrop(newDrops)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  async likeMessage() {
    if (!this.props.cached) {
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

  renderTxStatus() {
    if (this.props.cached) {
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

  renderDonations(msg) {
    return (
      <div className="col text-center">
        <div className="like-message-button mx-auto" onClick={this.likeMessage}>
          <img src={iconLike} width="20" height="20" className="" alt="likes" />
          <span className="like-number icon-number ml-1">{msg.likes}</span>
        </div>
      </div>
    )
  }

  render() {
    let commentsClass = this.getClass()
    let commentsNrClass = this.getNrClass()
    let msg = this.state.message
    // Quick workaround
    msg.username =
      msg.username.substr(0, 2) === '0x'
        ? this.context.drizzle.web3.utils.toUtf8(msg.username)
        : msg.username

    return (
      <Card className={`message-card mb-4 ${!this.props.cached ? '' : 'muted'}`}>
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
        {this.renderTxStatus()}
        <CardFooter className={`comments-card ${commentsClass}`}>
          {!this.props.cached &&
            this.state.message.initialized && <CommentListContainer message={msg} />}
        </CardFooter>
      </Card>
    )
  }
}

MessageItem.contextTypes = {
  drizzle: PropTypes.object,
}

export default MessageItem
