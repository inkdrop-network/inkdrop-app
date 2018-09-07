import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardFooter } from 'reactstrap'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageActions from './MessageActions'
import MessageActionsExtend from './MessageActionsExtend'
import CommentList from '../commentlist/CommentList'

// icons
// import inkdropDark from '../../../../public/icons/icon-inkdrop-dark.svg'
// import inkdropGreen from '../../../../public/icons/inkdrop_logo.svg'
// import iconLike from '../../../../public/icons/icon-like.svg'

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

  onDropsChange(value) {
    this.setState({ drops: parseFloat(value) })
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

  render() {
    let commentsClass = this.getClass()
    let msg = this.props.message

    return (
      <Card className={`message-card ${msg.fromBlockchain ? '' : 'muted'}`}>
        <MessageHeader msg={msg} />
        <MessageContent msg={msg} />
        <MessageActions
          msg={msg}
          toggleComments={this.toggleComments}
          onDropsChange={this.onDropsChange}
          dropMessage={this.dropMessage}
          drops={this.state.drops}
          commentsNrClass={this.getNrClass()}
        />
        <MessageActionsExtend
          balance={parseFloat(this.props.balance)}
          drops={this.state.drops}
          onDropsChange={this.onDropsChange}
        />

        {this.renderTxStatus()}
        <CardFooter className={`comments-card ${commentsClass}`}>
          {msg.fromBlockchain && <CommentList message={msg} />}
        </CardFooter>
      </Card>
    )
  }
}

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onMessageDrop: PropTypes.func.isRequired,
}

export default MessageItem
