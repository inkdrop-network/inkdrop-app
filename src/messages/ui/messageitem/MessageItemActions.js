import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const LIKE_MESSAGES = 'LIKE_MESSAGE'
function dispLikeMessage(message) {
  return {
    type: LIKE_MESSAGES,
    id: message.id,
    payload: message,
  }
}

export const DROP_MESSAGE = 'DROP_MESSAGE'
function dispDropMessage(message) {
  return {
    type: DROP_MESSAGE,
    id: message.id,
    payload: message,
  }
}

export function likeMessage(id, likes) {
  console.log('Liked message id: ' + id)
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

          // Attempt to like message
          authenticationInstance
            .likeMessage(id, { from: coinbase })
            .then(function(result) {
              return dispatch(
                dispLikeMessage({
                  id: id,
                  likes: likes + 1,
                })
              )
            })
            .catch(function(err) {
              // If error...
              console.log(err)
            })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.')
  }
}

export function dropMessage(id, dropsAdd, dropsTotal) {
  console.log('Dropped message id: ' + id)
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

          // Attempt to like message
          authenticationInstance
            .dropMessage(id, dropsAdd, { from: coinbase })
            .then(function(result) {
              return dispatch(
                dispDropMessage({
                  id: id,
                  drops: dropsTotal + dropsAdd,
                })
              )
            })
            .catch(function(err) {
              // If error...
              console.log(err)
            })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.')
  }
}
