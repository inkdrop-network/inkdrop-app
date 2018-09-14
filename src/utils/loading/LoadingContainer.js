import { drizzleConnect } from 'drizzle-react'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter } from 'reactstrap'
import { LOGOUT_REQUESTED } from '../../user/userSagas'

/*
 * Create component.
 */

class LoadingContainer extends Component {
  constructor(props, context) {
    super(props)
    this.context = context

    console.log('Create LoadingContainer')
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
          console.log('HERE 2!!!')
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
              console.log('HERE 1!!!')
              return true
            } else {
              return false
            }
          }
        }
      }
    }

    // console.log('LoadingContainer should update')
    // if (this.props.drizzleStatus.initialized) {
    //   console.log('INTIALIZED!!!')
    // }
    // console.log('-- drizzleStatus')
    // console.log(this.props.drizzleStatus)
    // console.log(nextProps.drizzleStatus)
    // console.log(this.props.drizzleStatus === nextProps.drizzleStatus)
    // console.log('-- Accounts')
    // console.log(this.props.accounts)
    // console.log(nextProps.accounts)
    // console.log(this.props.accounts === nextProps.accounts)
    // console.log('-- Balances')
    // console.log(this.props.accountBalances)
    // console.log(nextProps.accountBalances)
    // console.log(this.props.accountBalances === nextProps.accountBalances)
    // console.log('')
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
                    <li>Install MetaMask {this.props.web3.status === 'failed' ? '❌' : '👍'}</li>
                    <li>
                      Choose the Rinkeby network {this.getNetworkName() !== 'Rinkeby' ? '📛' : '💪'}
                    </li>
                    <li>
                      Log in to MetaMask{' '}
                      {this.props.web3.status === 'initialized' &&
                      Object.keys(this.props.accounts).length === 0
                        ? '🆘'
                        : '👌'}
                    </li>
                    <li>Get some Ether {this.getBalance() <= 0 ? '🚫' : '💸'}</li>
                  </ol>
                </CardBody>
                <CardFooter className="py-4">
                  <p>Possible solutions:</p>
                  <ol>
                    <li>
                      We recommend to use the Chrome/FireFox extension{' '}
                      <a href="https://metamask.io/" target="_blank">
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
                      <a href="https://faucet.rinkeby.io/" target="_blank">
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
              <h1>⚙️</h1>
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

LoadingContainer.propTypes = {
  accounts: PropTypes.object,
  accountBalances: PropTypes.object,
  drizzleStatus: PropTypes.object,
  user: PropTypes.object,
  web3: PropTypes.object,
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

const mapDispatchToProps = dispatch => {
  return {
    onLogoutUser: () => {
      dispatch({ type: LOGOUT_REQUESTED })
    },
  }
}

export default drizzleConnect(LoadingContainer, mapStateToProps, mapDispatchToProps)
