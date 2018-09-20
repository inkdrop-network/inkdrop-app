import React, { Component } from 'react'
// import SVG from 'react-inlinesvg'

// import loadingSpinner from '../../../public/icons/loading-spinner.svg'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="row">
          <div className="col my-5">
            {/*<SVG
              src={loadingSpinner}
              wrapper={React.createFactory('div')}
              className="m-auto text-center"
            />*/}
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
