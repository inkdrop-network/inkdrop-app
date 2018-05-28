import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const COMMENT_MESSAGE = 'COMMENT_MESSAGE'
function dispCommentMessage(message) {
  return {
    type: COMMENT_MESSAGE,
    parent: message.parent,
    payload: message,
  }
}

export function commentMessage(parent, username, imgUrl, message) {
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
            .commentMessage(parent, message, { from: coinbase })
            .then(function(result) {
              let newMsg = {
                content: message,
                username: username,
                timestamp: Date.now(),
                likes: 0,
                drops: 0,
                userUrl: imgUrl,
                userAdr: coinbase,
                id: Date.now(),
                parent: parent,
                comments: 0,
              }
              return dispatch(dispCommentMessage(newMsg))
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
