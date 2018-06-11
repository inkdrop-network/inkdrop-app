import React, { Component } from 'react'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="row">
          <div className="col my-4">
            <h1>Welcome to the InkDrop beta!</h1>
            <p>
              You have MetaMask be installed and set to the Rinkeby network in order to explore the
              platform.
            </p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
