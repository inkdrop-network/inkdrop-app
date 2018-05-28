import React, { Component } from 'react'
import { Form, FormGroup, Input, Button } from 'reactstrap'

class CommentItem extends Component {
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

  handleSubmit(event) {
    event.preventDefault()
    console.log('Comment message: ' + this.props.message.id + ' - ' + this.state.comment)
    this.props.commentMessage(
      this.props.message.id,
      this.props.username,
      this.props.imgUrl,
      this.state.comment
    )
    this.setState({ comment: '' })
  }

  render() {
    // render only comments that are fully fetched from the blockchain and not only initial comments' ids
    return (
      <Form onSubmit={this.handleSubmit}>
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
    )
  }
}

export default CommentItem
