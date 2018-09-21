import React, { Children, Component } from 'react'
// import { drizzleConnect } from 'drizzle-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter } from 'reactstrap'
import { LOGOUT_REQUESTED, LOGIN_REQUESTED } from '../../user/userSagas'

/*
 * Create component.
 */

class LoadingContainer extends Component {
  // constructor(props, context) {
  //   super(props)
  //   this.context = context
  // }

  componentDidUpdate(prevProps) {
    if (this.props.drizzleStatus.initialized) {
      // TODO: This is still not the optimal solution. You can do better!
      this.props.onLoginUser({ address: this.props.accounts[0] })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Check if the component should update once drizzle is initialized
    if (this.props.drizzleStatus.initialized) {
      // The account object should have already entries (length > 0)
      if (
        Object.keys(this.props.accounts).length > 0 &&
        Object.keys(nextProps.accounts).length > 0
      ) {
        // Compare the accounts in both stages
        let accountsCheck = this.props.accounts[0] === nextProps.accounts[0]

        // If accounts differ, log current user out and trigger update
        if (!accountsCheck) {
          console.log('Update LoadingContainer 3')
          this.props.onLogoutUser()
          return true
        } else {
          // The accountBalances object should have already entries
          if (
            Object.keys(this.props.accountBalances).length > 0 &&
            Object.keys(nextProps.accountBalances).length > 0
          ) {
            // Compare both balances
            let balancesCheck =
              this.props.accountBalances[this.props.accounts[0]] ===
              nextProps.accountBalances[nextProps.accounts[0]]

            // Do update if balances changed, otherwise don't
            if (!balancesCheck) {
              console.log('Update LoadingContainer 2')
              return true
            } else {
              return false
            }
          }
        }
      }
    }
    return true
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
      // return this.context.drizzle.web3.utils.fromWei(
      //   this.props.accountBalances[this.props.accounts[0]]
      // )
      return this.props.accountBalances[this.props.accounts[0]]
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
              <Card className="loading-card">
                <CardBody>
                  <h1 className="text-center">
                    <span className="font-green">WELCOME!</span> First Things First...
                  </h1>
                  <h4 className="text-center">Get Your Browser Ready For Web3</h4>
                  <p className="mt-4">
                    In order to interact with the InkDrop dApp, you just need a couple of things:
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
                      Login to MetaMask{' '}
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
                  <p>Solutions:</p>
                  <ol>
                    <li>
                      Install{' '}
                      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                        MetaMask
                      </a>, a Google Chrome extension, to enable your browser to run decentralized
                      apps. You can choose to use an existing Ethereum address or create a new one.
                      Alternatively, you can also use a dedicated Ethereum browsers like Mist or
                      Parity, or{' '}
                      <a
                        href="https://www.cipherbrowser.com/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Cipher
                      </a>{' '}
                      or{' '}
                      <a
                        href="https://de.trustwalletapp.com/features/trust-browser"
                        target="_blank"
                        rel="noopener noreferrer">
                        Trust
                      </a>{' '}
                      for mobile.
                    </li>
                    <li>
                      Since InkDrop is still under heavy development, we run it on the Rinkeby
                      testnet. Click on the upper left network dropdown in MetaMask and select the
                      Rinkeby network.
                    </li>
                    <li>Please log in to MetaMask and wait for the page reload.</li>
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
// LoadingContainer.contextTypes = {
//   drizzle: PropTypes.object,
// }

LoadingContainer.propTypes = {
  accounts: PropTypes.object.isRequired,
  accountBalances: PropTypes.object.isRequired,
  drizzleStatus: PropTypes.object.isRequired,
  user: PropTypes.object,
  loggedIn: PropTypes.bool.isRequired,
  web3: PropTypes.object.isRequired,
}
/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    accountBalances: state.accountBalances,
    drizzleStatus: state.drizzleStatus,
    loggedIn: state.user.loggedIn,
    web3: state.web3,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogoutUser: () => {
      dispatch({ type: LOGOUT_REQUESTED })
    },
    onLoginUser: user => {
      dispatch({ type: LOGIN_REQUESTED, user })
    },
  }
}

// export default drizzleConnect(LoadingContainer, mapStateToProps, mapDispatchToProps)
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingContainer)
