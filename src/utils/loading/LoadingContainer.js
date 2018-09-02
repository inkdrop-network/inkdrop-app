import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter } from 'reactstrap'

/*
 * Create component.
 */

class LoadingContainer extends Component {
  constructor(props, context) {
    super(props)
    this.context = context
  }

  getNetworkName() {
    if (process.env.NODE_ENV === 'development') {
      return 'Rinkeby'
    } else {
      switch (this.props.web3.networkId) {
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
        case 5777:
          return 'Ganache'
        default:
          return 'Unknown'
      }
    }
  }

  getBalance() {
    if (this.props.accounts[0] in this.props.accountBalances) {
      return this.context.drizzle.web3.utils.fromWei(
        this.props.accountBalances[this.props.accounts[0]]
      )
    } else {
      return 0
    }
  }
  render() {
    if (
      this.props.web3.status === 'failed' ||
      this.getNetworkName() !== 'Rinkeby' ||
      (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) ||
      this.getBalance() <= 0
    ) {
      return (
        <main className="container">
          <div className="row justify-content-center py-5">
            <div className="col-sm-7">
              <Card>
                <CardBody>
                  <h1 className="text-center">
                    New to <span className="font-green">Crypto</span>?
                  </h1>
                  <h4 className="text-center">Let's get you started</h4>
                  <p className="mt-4">
                    In order to interact with the InkDrop Ethereum app, you just need a couple of
                    things:
                  </p>
                  <ol>
                    <li>
                      Install MetaMask{' '}
                      <span role="img" aria-label="emoji">
                        {this.props.web3.status === 'failed' ? '⭕️' : '✅'}
                      </span>
                    </li>
                    <li>
                      Choose the Rinkeby network{' '}
                      <span role="img" aria-label="emoji">
                        {this.getNetworkName() !== 'Rinkeby' ? '⭕️' : '✅'}
                      </span>
                    </li>
                    <li>
                      Log in to MetaMask{' '}
                      <span role="img" aria-label="emoji">
                        {this.props.web3.status === 'initialized' &&
                        Object.keys(this.props.accounts).length === 0
                          ? '⭕️'
                          : '✅'}
                      </span>
                    </li>
                    <li>
                      Get some Ether{' '}
                      <span role="img" aria-label="emoji">
                        {this.getBalance() <= 0 ? '⭕️' : '✅'}
                      </span>
                    </li>
                  </ol>
                </CardBody>
                <CardFooter className="py-4">
                  <p>Possible solutions:</p>
                  <ol>
                    <li>
                      We recommend to use the Chrome/FireFox extension{' '}
                      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                        MetaMask
                      </a>, or dedicated Ethereum browsers like Mist or Parity.
                    </li>
                    <li>
                      Click on the upper left network dropdown in MetaMask and select the Rinkeby
                      network.
                    </li>
                    <li>Please log in to MetaMask and then refresh the page.</li>
                    <li>
                      Get some Ether with the{' '}
                      <a
                        href="https://faucet.rinkeby.io/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Rinkeby Ether Faucet
                      </a>.
                    </li>
                  </ol>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      )
    }

    if (this.props.drizzleStatus.initialized) {
      return Children.only(this.props.children)
    }
    return (
      <main className="bg-dark vh-100">
        <div className="container h-100">
          <div className="row justify-content-center pt-5">
            <div className="col-sm-7">
              <h1>
                <span role="img" aria-label="emoji">
                  ⚙️
                </span>
              </h1>
              <p>Loading dapp...</p>
            </div>
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
    accountBalances: state.accountBalances,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
  }
}
export default drizzleConnect(LoadingContainer, mapStateToProps)
