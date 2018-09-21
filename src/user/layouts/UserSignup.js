import React, { Component } from 'react'
import SignUpFormContainer from '../components/signupform/SignUpFormContainer'

class SignUp extends Component {
  render() {
    return (
      <main className="container">
        <div className="row justify-content-center my-4">
          <div className="col-sm-7">
            <h1>Who Are You?</h1>
            <p>Create a Profile Connected to Your Wallet</p>
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
