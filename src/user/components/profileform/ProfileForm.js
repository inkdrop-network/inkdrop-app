import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardBody,
  CardFooter,
  CustomInput,
  Label,
  Col,
} from 'reactstrap'
import ProfilePicture from '../profilepicture/ProfilePicture'

import loadingSpinner from '../../../icons/loading-spinner.svg'

class ProfileForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.user.name,
      bio: this.props.user.bio,
      address: this.props.accounts[0],
      imgUrl: this.props.user.imgUrl,
      buffer: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onBioChange = this.onBioChange.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.renderTxStatus = this.renderTxStatus.bind(this)
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

    let user = {
      name: this.state.name,
      bio: this.state.bio,
      drops: this.props.user.drops,
      followers: this.props.user.followers,
      address: this.props.accounts[0],
    }

    this.props.onUpdateUser(user, this.state.buffer)

    // this.setState({ submitting: true })

    // // TODO: Chech if double upload is needed
    // let ipfsHash = await ipfs.add(this.state.buffer)
    // this.setState({ ipfsHash: ipfsHash[0].hash })
    // this.setState({ imgUrl: `https://gateway.ipfs.io/ipfs/${ipfsHash[0].hash}` })

    // try {
    //   // this.contracts.Authentication.methods.signup
    //   await this.contracts.InkDrop.methods
    //     .updateUser(
    //       this.context.drizzle.web3.utils.fromAscii(this.state.name),
    //       this.state.bio,
    //       this.state.ipfsHash
    //     )
    //     .send()

    //   // dispatch login saga
    //   this.props.onUpdateUser({
    //     name: this.state.name,
    //     bio: this.state.bio,
    //     drops: this.props.user.drops,
    //     imgUrl: this.state.imgUrl,
    //     ipfsHash: this.state.ipfsHash,
    //     followers: this.props.user.followers,
    //   })
    //   this.setState({ submitting: false })
    // } catch (error) {
    //   console.log(error)
    // }
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
    reader2.onloadend = () => this.setState({ imgUrl: reader2.result })
  }

  async convertToBuffer(reader) {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result)
    //set this buffer -using es6 syntax
    this.setState({ buffer: buffer })
    // let ipfsHash = await ipfs.add(buffer)
    // this.setState({ ipfsHash: ipfsHash[0].hash })
    // this.setState({ imgUrl: `https://gateway.ipfs.io/ipfs/${ipfsHash[0].hash}` })
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
            <FormGroup row>
              <Label for="name" sm={2}>
                <strong>Username</strong>
              </Label>
              <Col sm={10}>
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
              </Col>
            </FormGroup>

            <FormGroup row className="mt-4">
              <Label for="bio" sm={2}>
                <strong>About You</strong>
              </Label>
              <Col sm={10}>
                <Input
                  id="bio"
                  type="text"
                  value={this.state.bio}
                  onChange={this.onBioChange}
                  placeholder="Tell the community a little more about yourself (optional)"
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="file" sm={2}>
                <strong>Profile Picture</strong>
              </Label>
              <Col sm={10}>
                <ProfilePicture
                  diameter={100}
                  address={this.state.address}
                  url={this.state.imgUrl}
                />
                <CustomInput
                  type="file"
                  name="file"
                  id="signup-user-img"
                  onChange={this.captureFile}
                  accept="image/gif, image/jpeg, image/png"
                  className="mt-2"
                  label="Change your profile picture"
                />
                {/*<FormText color="muted">
                Upload an image with square format and a minimum resolution of 150x150px. Only
                .jpeg, .png and .gif files are allowed.
              </FormText>*/}
              </Col>
            </FormGroup>

            <Button color="green" className="mt-4" block>
              Update Profile
            </Button>
          </Form>
        </CardBody>
        {this.renderTxStatus()}
      </Card>
    )
  }
}

ProfileForm.propTypes = {
  user: PropTypes.object,
  accounts: PropTypes.object,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  loading: PropTypes.bool,
  txMessage: PropTypes.string,
  onUpdateUser: PropTypes.func,
}

export default ProfileForm
