import React, { Component } from 'react'

class MessageForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: this.props.content,
    }
  }

  onContentChange(event) {
    this.setState({ content: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.state.content.length < 1)
    {
      return alert('Please share something valuable.')
    }

    this.props.onMessageSubmit(this.state.content);
    this.setState({ content: '' });
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <textarea id="content" rows="2" value={this.state.content} onChange={this.onContentChange.bind(this)} placeholder="Share something valuable"></textarea>
          <br />
          <button type="submit" className="pure-button pure-button-primary">Send</button>
        </fieldset>
      </form>
    )
  }
}

export default MessageForm
