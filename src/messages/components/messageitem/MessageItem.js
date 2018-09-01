import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap'
import Moment from 'react-moment'
import CommentList from '../commentlist/CommentList'

// icons
// import inkdropDark from '../../../../public/icons/icon-inkdrop-dark.svg'
// import inkdropGreen from '../../../../public/icons/inkdrop_logo.svg'
import iconLike from '../../../../public/icons/icon-like.svg'
import iconComment from '../../../../public/icons/icon-comments.svg'
import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class MessageItem extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showComments: false,
      drops: 0.001,
    }

    this.toggleComments = this.toggleComments.bind(this)
    this.onDropsChange = this.onDropsChange.bind(this)
    this.dropMessage = this.dropMessage.bind(this)
  }

  onDropsChange(event) {
    this.setState({ drops: parseFloat(event.target.value) })
  }

  async dropMessage() {
    if (!this.props.message.cached) {
      // TODO: add slider for amount of drops to be submitted
      let newDrops = this.state.drops
      if (this.state.drops > this.props.balance) {
        return alert("You don't have enough funds for this post.")
      } else {
        this.props.onMessageDrop(this.props.message, newDrops)
        this.setState({ drops: 0.001 })
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
    if (
      !this.props.message.fromBlockchain ||
      this.props.message.error ||
      this.props.message.sendingMessage
    ) {
      let message = ''
      let cls = 'text-muted'
      if (this.props.message.error) {
        message = this.props.message.error
        cls = 'text-danger'
      } else if (this.props.message.sendingMessage) {
        message = this.props.message.sendingMessage
      }
      return (
        <CardFooter className="tx-card py-0">
          <div className="row">
            <div className="col">
              {!this.props.message.error && (
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

  renderDonations(msg) {
    return (
      <div className="col text-center">
        <div className="like-message-button mx-auto">
          <img src={iconLike} width="20" height="20" className="" alt="likes" />
          <span className="like-number icon-number ml-1">{msg.likes}</span>
        </div>
      </div>
    )
  }

  render() {
    let commentsClass = this.getClass()
    let commentsNrClass = this.getNrClass()
    let msg = this.props.message

    return (
      <Card className={`message-card ${msg.fromBlockchain ? '' : 'muted'}`}>
        <CardBody className="d-flex flex-row pb-2">
          <img
            className="mr-2 profile-img"
            src={msg.userUrl || 'https://via.placeholder.com/50/85bd3e/85bd3e'}
            alt="profile"
          />
          <div>
            <Link to={`/user/${msg.userAdr}`} className="">
              <strong className="align-top d-block card-username">@{msg.username}</strong>
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
              <div className="comment-message-button float-left" onClick={this.toggleComments}>
                <img src={iconComment} width="20" height="20" className="" alt="comments" />
                <span className={`comment-number icon-number ml-1 ${commentsNrClass}`}>
                  {msg.commentIds.length}
                </span>
              </div>

              <div className="drop-message-button float-left ml-2">
                {/* <img src={inkdropDark} width="20" height="20" className="drops" alt="" /> */}
                <span className="drop-number icon-number">{msg.drops} ETH</span>
              </div>
            </div>

            <div className="col-4">
              <InputGroup size="sm">
                <Input
                  type="number"
                  value={this.state.drops}
                  min="0.001"
                  max="100"
                  step="0.001"
                  onChange={this.onDropsChange}
                />
                <InputGroupAddon addonType="append" onClick={this.dropMessage}>
                  <InputGroupText>
                    Add ETH
                    {/* <img src={inkdropGreen} width="20" height="20" className="drops ml-3" alt="" />*/}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {/* <div className="drop-message-button float-right" onClick={this.dropMessage}>
                <img src={inkdropGreen} width="20" height="20" className="drops" alt="" />
              </div> */}
            </div>
          </div>
        </CardBody>
        {this.renderTxStatus()}
        <CardFooter className={`comments-card ${commentsClass}`}>
          {msg.fromBlockchain && <CommentList message={msg} />}
        </CardFooter>
      </Card>
    )
  }
}

MessageItem.propTypes = {
  message: PropTypes.object,
  user: PropTypes.object,
  onMessageDrop: PropTypes.func,
  onMessageLike: PropTypes.func,
}

export default MessageItem
