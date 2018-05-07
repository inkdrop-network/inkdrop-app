import React, { Component } from 'react'
import { Button, Form, FormGroup, FormText, Input } from 'reactstrap'

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      bio: '',
      userUrl: '',
      buffer: '',
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

    if (this.state.name.length < 2) {
      return alert('Please fill in your name.')
    }

    this.props.onSignUpFormSubmit(this.state.name, this.state.bio, this.state.buffer)
  }

  captureFile(event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)

    const file2 = event.target.files[0]
    let reader2 = new window.FileReader()
    reader2.readAsDataURL(file2)
    reader2.onloadend = () => this.setState({ userUrl: reader2.result })
  }

  async convertToBuffer(reader) {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result)
    //set this buffer -using es6 syntax
    this.setState({ buffer: buffer })
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <FormGroup>
          <img
            id="signup-profile-picture"
            className="profile-img mb-2"
            src={this.state.userUrl || 'http://via.placeholder.com/150/85bd3e/85bd3e'}
            alt="profile"
          />
          <Input
            type="file"
            name="file"
            id="signup-user-img"
            onChange={this.captureFile.bind(this)}
            accept="image/gif, image/jpeg, image/png"
            required
          />
          <FormText color="muted">
            Upload an image with square format and a minimum resolution of 150x150px. Only .jpeg,
            .png and .gif files are allowed.
          </FormText>
        </FormGroup>
        <FormGroup>
          <Input
            id="name"
            type="text"
            value={this.state.name}
            onChange={this.onNameChange.bind(this)}
            placeholder="Your name"
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            id="bio"
            type="text"
            value={this.state.bio}
            onChange={this.onBioChange.bind(this)}
            placeholder="Tell us something about yourself"
          />
        </FormGroup>
        <Button color="green">Sign Up</Button>
      </Form>
    )
  }
}

export default SignUpForm
