import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter } from 'reactstrap'
import MessageHeader from './components/MessageHeader'
import MessageActions from './components/MessageActions'
import MessageActionsExtend from './components/MessageActionsExtend'
import MessageModal from './MessageModal'
import { roundFloat3 } from '../../../utils/rounder'

// icons
// import inkdropDark from '../../../../public/icons/icon-inkdrop-dark.svg'
// import inkdropGreen from '../../../../public/icons/inkdrop_logo.svg'
// import iconLike from '../../../../public/icons/icon-like.svg'

import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class MessageItem extends PureComponent {
  constructor(props, context) {
    super(props)

    this.web3 = context.drizzle.web3

    this.state = {
      showActions: false,
      showModal: false,
      showComments: false,
      drops: 0.001, // 0.001 ETH
    }

    this.toggleActions = this.toggleActions.bind(this)
    this.toggleComments = this.toggleComments.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
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

  toggleActions() {
    this.setState(prevState => {
      return { showActions: !prevState.showActions }
    })
  }

  toggleComments() {
    this.setState(prevState => {
      return { showComments: !prevState.showComments }
    })
  }

  toggleModal() {
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal,
        showComments: true,
      }
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
    let msg = this.props.message

    return (
      <Card className={`message-card ${msg.fromBlockchain ? '' : 'muted'}`}>
        <CardBody>
          <MessageHeader msg={msg} extended={false} />
        </CardBody>
        <CardBody className="py-2" onClick={this.toggleModal}>
          {msg.content}
        </CardBody>
        <MessageActions
          msg={msg}
          active={this.state.showActions}
          toggleComments={this.toggleModal}
          toggleActions={this.toggleActions}
          drops={this.state.drops}
        />
        {this.state.showActions && (
          <MessageActionsExtend
            maxValue={roundFloat3(this.web3.utils.fromWei(`${this.props.balance}`, 'ether'))}
            value={this.state.drops}
            onDropsChange={this.onDropsChange}
            dropMessage={this.dropMessage}
          />
        )}

        {this.renderTxStatus()}
        <MessageModal
          msg={msg}
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          maxValue={roundFloat3(this.web3.utils.fromWei(`${this.props.balance}`, 'ether'))}
          value={this.state.drops}
          onDropsChange={this.onDropsChange}
          dropMessage={this.dropMessage}
          toggleComments={this.toggleComments}
          showComments={this.state.showComments}
        />
      </Card>
    )
  }
}

MessageItem.contextTypes = {
  drizzle: PropTypes.object,
}

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onMessageDrop: PropTypes.func.isRequired,
}

export default MessageItem
