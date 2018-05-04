import React, { Component } from 'react'
import { Card, CardBody } from 'reactstrap'
import ProfileFormContainer from '../../ui/profileform/ProfileFormContainer'

class Profile extends Component {
  render() {
    return (
      <main className="container">
        <div className="row justify-content-center my-4">
          <div className="col-sm-7">
            <h1>Profile</h1>
            <p>Edit your account details here.</p>
            <div id="profile-update">
              <Card className="profile-card">
                <CardBody>
                  <ProfileFormContainer />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile
