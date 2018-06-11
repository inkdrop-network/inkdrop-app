import React, { Component } from 'react'
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
              <SignUpFormContainer />
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default SignUp
