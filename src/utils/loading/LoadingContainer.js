import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'

/*
 * Create component.
 */

class LoadingContainer extends Component {
  getNetworkName(networkId) {
    switch (networkId) {
      case 1:
        return 'Main'
      case 2:
        return 'Morden'
      case 3:
        return 'Ropsten'
      case 4:
        return 'Rinkeby'
      case 42:
        return 'Kovan'
      default:
        return 'Unknown'
    }
  }
  render() {
    if (this.props.web3.status === 'failed') {
      if (this.props.errorComp) {
        return this.props.errorComp
      }

      return (
        <main className="container loading-screen">
          <div className="row">
            <div className="col m-4">
              <h1>⚠️</h1>
              <p>
                This browser has no connection to the Ethereum network. Please use the
                Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.
              </p>
            </div>
          </div>
        </main>
      )
    }

    if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) {
      // TODO: check for rinkeby network
      console.log(this.getNetworkName(this.props.web3.networkId))

      return (
        <main className="container loading-screen">
          <div className="row">
            <div className="col m-4">
              <h1>🦊</h1>
              <p>
                <strong>We can't find any Ethereum accounts!</strong> Please check and make sure
                Metamask or you browser are pointed at the correct network and your account is
                unlocked.
              </p>
            </div>
          </div>
        </main>
      )
    }
    if (this.props.drizzleStatus.initialized) {
      return Children.only(this.props.children)
    }
    if (this.props.loadingComp) {
      return this.props.loadingComp
    }
    return (
      <main className="container loading-screen">
        <div className="row">
          <div className="col m-4">
            <h1>⚙️</h1>
            <p>Loading dapp...</p>
          </div>
        </div>
      </main>
    )
  }
}
LoadingContainer.contextTypes = {
  drizzle: PropTypes.object,
}
/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
  }
}
export default drizzleConnect(LoadingContainer, mapStateToProps)
