import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, FormGroup, Input, Card, CardBody } from 'reactstrap'
import { roundFloat3 } from '../../../utils/rounder'

class MessageForm extends PureComponent {
  constructor(props, context) {
    super(props)

    this.web3 = context.drizzle.web3

    this.state = {
      content: '',
      drops: 0, // TODO: add drop slider
      focus: false,
    }

    this.onContentChange = this.onContentChange.bind(this)
    this.onDropsChange = this.onDropsChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
  }

  onFocus() {
    this.setState({ focus: true })
  }

  onBlur() {
    this.setState({ focus: false })
  }

  getClass() {
    if (this.state.focus === true) return 'selected'
    else return ''
  }

  onContentChange(event) {
    this.setState({ content: event.target.value })
  }

  onDropsChange(event) {
    this.setState({ drops: parseFloat(event.target.value) })
  }

  async handleSubmit(event) {
    event.preventDefault()
    if (this.state.drops > this.props.balance) {
      return alert("Yu don't have enough funds for this post.")
    }

    if (this.state.content === '' && this.state.content.length < 2) {
      return alert('Please share something valuable.')
    }

    if (!(this.state.drops >= 0)) {
      return alert('Please add some drops to your post.')
    }

    let newMsg = {
      content: this.state.content,
      username: this.props.user.name,
      timestamp: Date.now(),
      likes: 0,
      drops: this.state.drops,
      userUrl: this.props.user.imgUrl,
      userAdr: this.props.accounts[0],
      id: this.props.messages_total,
      commentIds: [],
      comments: [],
      fromBlockchain: false,
      initialized: false,
    }

    this.props.onCreateMessage(newMsg)
    // TODO: delete content after TX_BROADCAST
    this.setState({ content: '', drops: 0 })
  }

  render() {
    var inputClass = this.getClass()
    return (
      <div id="post-message" className={`col-sm-7 ${inputClass}`}>
        <Card className="message-card">
          <CardBody className="d-flex flex-row pb-2">
            <img
              id="post-message-profile-picture"
              className="mr-2 profile-img"
              src={this.props.user.imgUrl || 'https://via.placeholder.com/50/85bd3e/85bd3e'}
              alt="profile"
            />
            <div>
              <strong id="post-message-username" className="align-top d-block card-username">
                @{this.props.user.name}
              </strong>
              <span className="card-message-time">now</span>
            </div>
          </CardBody>
          <CardBody className="py-2">
            <div id="send-area">
              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Input
                    type="textarea"
                    name="text"
                    rows="2"
                    id="content"
                    placeholder="Share something valuable"
                    value={this.state.content}
                    onChange={this.onContentChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                  />
                  <label>Add ETHs to boost your post</label>
                  <input
                    type="range"
                    name="range"
                    className="custom-range"
                    id="drop-range"
                    min="0"
                    max={this.props.balance}
                    steps="1000000000000000"
                    value={this.state.drops}
                    onChange={this.onDropsChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                  />
                  <label htmlFor="drop-range" className="float-right">
                    {roundFloat3(this.web3.utils.fromWei(`${this.state.drops}`, 'ether'))} ETH
                  </label>
                </FormGroup>
                <Button color="green">Send</Button>
              </Form>
            </div>
          </CardBody>
          <CardBody className="pt-2">
            <div className="row">
              <div className="col">
                <div id="write-message-photo" className="float-left">
                  <img
                    src="icons/icon-photo.svg"
                    width="20"
                    height="20"
                    className=""
                    alt="add snapshot"
                  />
                </div>
              </div>
              <div className="col">
                <div id="write-message-video" className="mx-auto">
                  <img
                    src="icons/icon-video.svg"
                    width="20"
                    height="20"
                    className=""
                    alt="add video"
                  />
                </div>
              </div>
              <div className="col text-right">
                <div id="write-message-place" className="float-right mr-3">
                  <img
                    src="icons/icon-place.svg"
                    width="20"
                    height="20"
                    className=""
                    alt="add location"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

MessageForm.contextTypes = {
  drizzle: PropTypes.object,
}

MessageForm.propTypes = {
  accounts: PropTypes.object,
  user: PropTypes.object,
  messages: PropTypes.array,
}

export default MessageForm
