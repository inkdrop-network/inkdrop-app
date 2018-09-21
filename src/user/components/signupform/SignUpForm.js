import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardBody,
  CardFooter,
  Label,
} from 'reactstrap'
import ProfilePicture from '../profilepicture/ProfilePicture'

import loadingSpinner from '../../../icons/loading-spinner.svg'

class SignUpForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      bio: '',
      address: this.props.accounts[0],
      userUrl: '',
      buffer: '',
      tos_accepted: false,
      privacy_accepted: false,
    }

    this.renderTxStatus = this.renderTxStatus.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onBioChange = this.onBioChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
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

    if (!(this.state.tos_accepted && this.state.privacy_accepted)) {
      return alert('Please read and agree to our Terms of Service and Privacy Policy.')
    }

    let user = {
      name: this.state.name,
      bio: this.state.bio,
      address: this.props.accounts[0],
    }

    // console.log(this.state.buffer)
    this.props.onSignupUser(user, this.state.buffer)
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
    // this.props.onIpfsUpload(buffer)
  }

  handleCheckboxChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }

  renderTxStatus() {
    if (this.props.error || this.props.txMessage) {
      let message = ''
      let cls = ''
      if (this.props.error) {
        message = this.props.errorMessage
        cls = 'text-danger'
      } else if (this.props.txMessage) {
        cls = this.props.loading ? 'text-muted' : 'text-green'
        message = this.props.txMessage
      }
      return (
        <CardFooter className="tx-card py-0">
          <div className="row">
            <div className="col text-right">
              {this.props.loading && (
                <img
                  className="mr-2 my-1"
                  src={loadingSpinner}
                  alt="profile"
                  width="20"
                  height="20"
                />
              )}
              <small className={cls}>{message}</small>
            </div>
          </div>
        </CardFooter>
      )
    }
  }

  render() {
    return (
      <Card className="profile-card">
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <ProfilePicture
                diameter={100}
                address={this.state.address}
                url={this.state.userUrl}
              />
              <Input
                type="file"
                name="file"
                id="signup-user-img"
                onChange={this.captureFile}
                accept="image/gif, image/jpeg, image/png"
              />
              <FormText color="muted">
                Upload an image with square format and a minimum resolution of 150x150px. Only
                .jpeg, .png and .gif files are allowed.
              </FormText>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                <Input
                  id="name"
                  type="text"
                  value={this.state.name}
                  onChange={this.onNameChange}
                  placeholder="How should we call you"
                  required
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Input
                id="bio"
                type="text"
                value={this.state.bio}
                onChange={this.onBioChange}
                placeholder="Tell the community a little more about yourself"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="tos_accepted"
                  checked={this.tos_accepted}
                  onChange={this.handleCheckboxChange}
                />
                I have read and agree to the{' '}
                <a
                  href="https://inkdrop.tech/tos.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green">
                  Terms of Service
                </a>
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="privacy_accepted"
                  checked={this.privacy_accepted}
                  onChange={this.handleCheckboxChange}
                />
                I have read and agree to the{' '}
                <a
                  href="https://inkdrop.tech/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green">
                  Privacy Policy
                </a>
              </Label>
            </FormGroup>
            <Button color="green" className="mt-3" block>
              Sign Up
            </Button>
          </Form>
        </CardBody>
        {this.renderTxStatus()}
      </Card>
    )
  }
}

SignUpForm.propTypes = {
  signup: PropTypes.object,
  accounts: PropTypes.object,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  loading: PropTypes.bool,
  txMessage: PropTypes.string,
  onSignupUser: PropTypes.func,
  onIpfsUpload: PropTypes.func,
}

export default SignUpForm
