import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Input, Button } from 'reactstrap'

class CommentForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      comment: '',
    }

    this.handleComment = this.handleComment.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleComment(event) {
    this.setState({ comment: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()
    if (this.state.comment === '' && this.state.content.length < 2) {
      return alert('Please share something valuable.')
    }
    let newComm = {
      content: this.state.comment,
      username: this.props.user.name,
      timestamp: Date.now(),
      likes: 0,
      drops: 0,
      userUrl: this.props.user.imgUrl,
      userAdr: this.props.accounts[0],
      id: this.props.message.comments.length, // TODO: set right id
      parent: this.props.message.id,
      fromBlockchain: false,
      initialized: false,
    }

    this.props.onCommentMessage(newComm)
    this.setState({ comment: '' })
  }

  render() {
    // render only comments that are fully fetched from the blockchain and not only initial comments' ids
    return (
      <div className="w-100">
        <div className="d-flex flex-row pb-2">
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
        </div>
        <Form className="pt-2" onSubmit={this.handleSubmit}>
          <FormGroup>
            <Input
              value={this.state.comment}
              onChange={this.handleComment}
              type="textarea"
              name="comment"
              rows="2"
              placeholder="Your comment"
            />
          </FormGroup>
          <Button color="green">Comment</Button>
        </Form>
      </div>
    )
  }
}

CommentForm.propTypes = {
  message: PropTypes.object,
  user: PropTypes.object,
  accounts: PropTypes.object,
  onCommentMessage: PropTypes.func,
}

export default CommentForm
