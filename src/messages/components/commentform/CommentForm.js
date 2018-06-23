import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Input, Button } from 'reactstrap'

class CommentForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      comment: '',
      stackId: '',
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
    // TODO: continue here
    this.props.onCommentMessage(newComm)
    this.setState({ comment: '' })

    // try {
    //   const stackId = await this.contracts.InkDrop.methods.createComment.cacheSend(
    //     this.props.message.id,
    //     this.state.comment
    //   )
    //   this.setState({ stackId: stackId })

    //   let newComm = {
    //     content: this.state.comment,
    //     username: this.props.user.name,
    //     timestamp: Date.now(),
    //     likes: 0,
    //     drops: 0,
    //     userUrl: this.props.user.imgUrl,
    //     userAdr: this.props.accounts[0],
    //     id: stackId,
    //     parent: this.props.message.id,
    //     fromBlockchain: false,
    //     initialized: false,
    //   }
    //   // trigger saga
    //   this.props.onCommentMessage(newComm)
    //   this.setState({ comment: '', stackId: '' })
    // } catch (error) {
    //   console.log(error)
    // }
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

CommentForm.propTypes = {
  message: PropTypes.object,
}

export default CommentForm
