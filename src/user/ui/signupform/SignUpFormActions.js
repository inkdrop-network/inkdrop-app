import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../../../store'
import ipfs from '../../../ipfs'

const contract = require('truffle-contract')

export function signedUpUser() {
  console.log('User signed up!1')
  return function(dispatch) {
    console.log('User signed up!')
    dispatch(loginUser())
    // Used a manual redirect here as opposed to a wrapper.
    // This way, once logged in a user can still access the home page.
    // var currentLocation = browserHistory.getCurrentLocation()

    // if ('redirect' in currentLocation.query) {
    //   return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    // }

    // return browserHistory.push('/newsfeed')
  }
}

export function signUpUser(name, bio, buffer) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {
    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error)
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance

          ipfs
            .add(buffer)
            .then(function(ipfsHash) {
              // TODO: signup not triggered anymore
              console.log(ipfsHash[0].hash)
              // If you are connected to an IPFS node, then you should be able to see your file at one of the IPFS gateways.
              // https://gateway.ipfs.io/ipfs/ + your IPFShash#

              // Attempt to sign up user.
              authenticationInstance
                .signup(name, bio, ipfsHash[0].hash, { from: coinbase })
                .then(function(result) {
                  // If no error, login user.
                  console.log('Signed up!')
                  // var userName = web3.toUtf8(result[0]);
                  // var userBio = result[1];
                  // console.log('User: ' + userName + ' ('+ userBio + ') signed up!');
                  return dispatch(loginUser())
                })
                .catch(function(err) {
                  // If error...
                  console.log(err)
                })
            })
            .catch(function(err) {
              console.log(err)
            })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.')
  }
}
