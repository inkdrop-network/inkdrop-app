import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const MESSAGE_POSTED = 'MESSAGE_POSTED'
function messagePosted(content) {
  return {
    type: MESSAGE_POSTED,
    payload: content
  }
}

export function postMessage(content, username, imgUrl) {
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

          // Attempt to login user.
          authenticationInstance
            .writeMessage(content, { from: coinbase })
            .then(function(result) {
              // If no error, update user.
              let newMsg = {
                content: content,
                username: username,
                timestamp: Date.now(),
                likes: 0,
                drops: 0,
                userUrl: imgUrl,
                userAdr: coinbase,
                id: Date.now(),
                comments: [],
                fromBlockchain: false
              }

              return dispatch(messagePosted(newMsg))
            })
            .catch(function(result) {
              // If error...
            })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.')
  }
}
