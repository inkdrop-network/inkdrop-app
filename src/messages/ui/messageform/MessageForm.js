import React, { Component } from 'react'
import { Button, Form, FormGroup, Input, Card, CardBody } from 'reactstrap'

class MessageForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: this.props.content,
      username: this.props.username,
      imgUrl: this.props.imgUrl || 'http://via.placeholder.com/50/85bd3e/85bd3e',
      focus: false,
    }
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

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.content.length < 2) {
      return alert('Please share something valuable.')
    }

    this.props.onMessageSubmit(this.state.content, this.state.username, this.state.imgUrl)
    this.setState({ content: '' })
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
              src={this.state.imgUrl}
              alt="profile"
            />
            <div>
              <strong id="post-message-username" className="align-top d-block card-username">
                c/{this.state.username}
              </strong>
              <span className="card-message-time">now</span>
            </div>
          </CardBody>
          <CardBody className="py-2">
            <div id="send-area">
              <Form onSubmit={this.handleSubmit.bind(this)}>
                <FormGroup>
                  <Input
                    type="textarea"
                    name="text"
                    rows="2"
                    id="content"
                    placeholder="Share something valuable"
                    value={this.state.content}
                    onChange={this.onContentChange.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                  />
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

export default MessageForm
