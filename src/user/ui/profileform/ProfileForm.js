import React, { Component } from 'react'

class ProfileForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name,
      bio: this.props.bio,
    }
  }

  onNameChange(event) {
    this.setState({ name: event.target.value })
  }

  onBioChange(event) {
    this.setState({ bio: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.state.name.length < 2)
    {
      return alert('Please fill in your name.')
    }

    this.props.onProfileFormSubmit(this.state.name, this.state.bio)
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={this.state.name} onChange={this.onNameChange.bind(this)} placeholder="Name" />
          <span className="pure-form-message">This is a required field.</span>
          <label htmlFor="bio">Bio</label>
          <input id="bio" type="text" value={this.state.bio} onChange={this.onBioChange.bind(this)} placeholder="Bio" />
          <br />
          <button type="submit" className="pure-button pure-button-primary">Update</button>
        </fieldset>
      </form>
    )
  }
}

export default ProfileForm
