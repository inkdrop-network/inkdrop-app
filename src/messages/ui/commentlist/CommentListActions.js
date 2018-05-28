import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const COMMENTS_GOT = 'COMMENTS_GOT'
function gotComments(parent, comments) {
  return {
    type: COMMENTS_GOT,
    parent: parent,
    payload: comments,
  }
}

export function getComments(parent, comments) {
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

          let promiseChain = []
          for (let i = 0; i < comments.length; i++) {
            promiseChain.push(authenticationInstance.getComment(parseInt(comments[i], 10)))
          }

          Promise.all(promiseChain)
            .then(function(result) {
              // result as an array of all callbacks from the getMessage function calls in the promise chain
              // sort the result array according their drop count
              let sortedRes = result.sort(function(a, b) {
                return parseInt(b[4], 10) - parseInt(a[4], 10)
              })
              let allMsgs = { comments: [] }
              for (let i = 0; i < sortedRes.length; i++) {
                let msg = {
                  content: sortedRes[i][0],
                  username: web3.toAscii(sortedRes[i][1]),
                  timestamp: new Date(sortedRes[i][2] * 1000),
                  likes: parseInt(sortedRes[i][3], 10),
                  drops: parseInt(sortedRes[i][4], 10),
                  userUrl: `https://gateway.ipfs.io/ipfs/${sortedRes[i][5]}`,
                  userAdr: sortedRes[i][6],
                  id: parseInt(sortedRes[i][7], 10),
                  comments: sortedRes[i][9].map(function(e) {
                    return parseInt(e, 10)
                  }),
                }
                allMsgs.comments.push(msg)
              }
              return dispatch(gotComments(parent, allMsgs))
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
