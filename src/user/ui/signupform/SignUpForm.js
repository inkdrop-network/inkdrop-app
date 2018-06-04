import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { Button, Form, FormGroup, FormText, Input } from 'reactstrap'
import ipfs from '../../../ipfs'

class SignUpForm extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts

    this.state = {
      name: '',
      bio: '',
      userUrl: '',
      buffer: '',
      ipfsHash: '',
    }

    // TODO: Check https://github.com/NFhbar/Token-Deployer/blob/master/src/layouts/home/Home.js
  }

  onNameChange(event) {
    this.setState({ name: event.target.value })
  }

  onBioChange(event) {
    this.setState({ bio: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()

    if (this.state.name.length < 2) {
      return alert('Please fill in your name.')
    }

    // this.props.onSignUpFormSubmit(this.state.name, this.state.bio, this.state.buffer)
    if (this.state.ipfsHash === '') {
      let ipfsHash = await ipfs.add(this.state.buffer)
      this.setState({ ipfsHash: ipfsHash[0].hash })
    }

    try {
      // this.contracts.Authentication.methods.signup
      await this.contracts.InkDrop.methods
        .createUser(
          this.context.drizzle.web3.utils.fromAscii(this.state.name),
          this.state.bio,
          this.state.ipfsHash
        )
        .send()

      // dispatch login saga
      this.props.onSignupUser({
        name: this.state.name,
        bio: this.state.bio,
        drops: 0,
        ipfsHash: this.state.ipfsHash,
        imgUrl: `https://gateway.ipfs.io/ipfs/${this.state.ipfsHash}`,
        followers: 0,
      })
    } catch (error) {
      console.log(error)
    }

    // Used a manual redirect here as opposed to a wrapper.
    // This way, once logged in a user can still access the home page.
    var currentLocation = browserHistory.getCurrentLocation()

    if ('redirect' in currentLocation.query) {
      return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }

    browserHistory.push('/newsfeed')
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
    //set this buffer
    this.setState({ buffer: buffer })
    let ipfsHash = await ipfs.add(buffer)
    this.setState({ ipfsHash: ipfsHash[0].hash })
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

SignUpForm.contextTypes = {
  drizzle: PropTypes.object,
}

export default SignUpForm
