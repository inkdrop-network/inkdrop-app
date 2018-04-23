import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const MESSAGES_GOT = 'MESSAGES_GOT'
function gotMessages(messages) {
  return {
    type: MESSAGES_GOT,
    payload: messages
  }
}

export function getMessages() {
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
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance

          // Attempt to login user.
          authenticationInstance.msgCount.call()
          .then(function(result) {
            let length = parseInt(result.toNumber());
            console.log('Message count: ' + length);

            // return dispatch(gotMessages(content));
            return;

          })
          .catch(function(result) {
            // If error...
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
