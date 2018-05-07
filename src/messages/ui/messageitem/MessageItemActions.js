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

export const COMMENT_MESSAGE = 'COMMENT_MESSAGE'
function dispCommentMessage(message) {
  return {
    type: COMMENT_MESSAGE,
    parent: message.parent,
    payload: message,
  }
}

export const COMMENTS_GOT = 'COMMENTS_GOT'
function gotComments(parent, comments) {
  return {
    type: COMMENTS_GOT,
    parent: parent,
    payload: comments,
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
            promiseChain.push(authenticationInstance.getComment(comments[i]))
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
                  comments: sortedRes[i][9],
                }
                allMsgs.comments.push(msg)
              }
              return dispatch(gotComments(parent, allMsgs))
            })
            .catch(function(err) {
              console.log(err.message)
            })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.')
  }
}
