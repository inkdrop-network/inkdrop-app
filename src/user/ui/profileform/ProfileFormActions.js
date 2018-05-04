import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import store from '../../../store'
import ipfs from '../../../ipfs'

const contract = require('truffle-contract')

export const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user,
  }
}

export function updateUser(name, bio, buffer) {
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
              // Attempt to login user.
              authenticationInstance
                .updateProfile(name, bio, ipfsHash[0].hash, { from: coinbase })
                .then(function(result) {
                  // If no error, update user.
                  console.log(name + "'s profile updated")

                  return dispatch(
                    userUpdated({
                      name: name,
                      bio: bio,
                      imgUrl: `https://gateway.ipfs.io/ipfs/${ipfsHash[0].hash}`,
                    })
                  )
                })
                .catch(function(err) {
                  // If error...
                  console.log(err)
                })
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
