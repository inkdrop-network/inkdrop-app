import React, { Component } from 'react'
import { Card, CardBody } from 'reactstrap'
import SignUpFormContainer from '../../ui/signupform/SignUpFormContainer'

class SignUp extends Component {
  render() {
    return (
      <main className="container">
        <div className="row justify-content-center my-4">
          <div className="col-sm-7">
            <h1>Sign Up</h1>
            <p>
              We've got your wallet information, simply input your name and your account is made!
            </p>
            <div id="signup-form">
              <Card className="profile-card">
                <CardBody>
                  <SignUpFormContainer />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default SignUp
