import React, { Component } from 'react'
import ProfileFormContainer from '../components/profileform/ProfileFormContainer'

class Profile extends Component {
  render() {
    return (
      <main className="container">
        <div className="row justify-content-center my-4">
          <div className="col-12 col-md-10 col-lg-9 col-xl-7">
            <h1>Profile</h1>
            <p>Edit your account details here.</p>
            <div id="profile-update">
              <ProfileFormContainer />
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile
