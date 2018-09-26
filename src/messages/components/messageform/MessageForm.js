import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, FormGroup, Input, Card, CardBody } from 'reactstrap'
import InputRangeSlider from '../rangeslider/InputRangeSlider'
import ProfilePicture from '../../../user/components/profilepicture/ProfilePicture'
import { roundFloat3 } from '../../../utils/rounder'

import iconPhoto from '../../../icons/icon-photo.svg'
import iconVideo from '../../../icons/icon-video.svg'
import iconPlace from '../../../icons/icon-place.svg'

class MessageForm extends PureComponent {
  constructor(props, context) {
    super(props)

    this.web3 = context.drizzle.web3

    // TODO: Remove focus from state. Always show MessageForm with no opacitiy!

    this.state = {
      content: '',
      drops: 0,
    }

    this.onContentChange = this.onContentChange.bind(this)
    this.onDropsChange = this.onDropsChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onContentChange(event) {
    this.setState({ content: event.target.value })
  }

  onDropsChange(value) {
    this.setState({ drops: parseFloat(value) })
  }

  async handleSubmit(event) {
    event.preventDefault()
    if (this.state.drops > this.props.balance) {
      return alert("You don't have enough funds for this post.")
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
      timestamp: new Date(),
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
    // Delete content after TX_BROADCAST
    this.setState({ content: '', drops: 0 })
  }

  render() {
    let currentBalance = roundFloat3(this.web3.utils.fromWei(`${this.props.balance}`, 'ether'))

    return (
      <Card className="message-card">
        <CardBody className="d-flex flex-row pb-2">
          <ProfilePicture
            diameter={50}
            address={this.props.accounts[0]}
            url={this.props.user.imgUrl}
          />
          <div className="ml-2">
            <strong id="post-message-username" className="align-top d-block card-username">
              @{this.props.user.name}
            </strong>
            <span className="card-message-time">now</span>
          </div>
        </CardBody>
        <CardBody className="py-2">
          <div id="send-area">
            <Form onSubmit={this.handleSubmit}>
              <FormGroup className="mb-0">
                <Input
                  type="textarea"
                  name="text"
                  rows="2"
                  id="content"
                  className="mb-3"
                  placeholder="Share something valuable"
                  value={this.state.content}
                  onChange={this.onContentChange}
                />
                {currentBalance > Number(process.env.REACT_APP_MIN_DROP) && (
                  <div>
                    <label>Add ETH to boost your post</label>
                    <InputRangeSlider
                      minValue={0}
                      maxValue={currentBalance}
                      value={this.state.drops}
                      onChange={this.onDropsChange}
                    />
                  </div>
                )}
              </FormGroup>
              <Button color="green" block className="mt-3">
                Send
              </Button>
            </Form>
          </div>
        </CardBody>
        <CardBody className="pt-2">
          <div className="row">
            <div className="col">
              <div id="write-message-photo" className="float-left">
                <img src={iconPhoto} width="20" height="20" className="" alt="add snapshot" />
              </div>
            </div>
            <div className="col">
              <div id="write-message-video" className="mx-auto">
                <img src={iconVideo} width="20" height="20" className="" alt="add video" />
              </div>
            </div>
            <div className="col text-right">
              <div id="write-message-place" className="float-right mr-3">
                <img src={iconPlace} width="20" height="20" className="" alt="add location" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
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
  onCreateMessage: PropTypes.func,
}

export default MessageForm
