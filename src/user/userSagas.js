import { put, takeEvery, getContext } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { browserHistory } from 'react-router'
import { USER_LOGGED_IN, USER_LOGGED_OUT, USER_UPDATED } from './userReducer'

// saga actions actions
const LOGIN_REQUESTED = 'LOGIN_REQUESTED'
const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED'
const SIGNUP_REQUESTED = 'SIGNUP_REQUESTED'
const USERUPDATE_REQUESTED = 'USERUPDATE_REQUESTED'

// drizzle's transactions events
const TX_CONFIRMAITON = 'TX_CONFIRMAITON'
const TX_BROADCASTED = 'TX_BROADCASTED'
const TX_SUCCESSFUL = 'TX_SUCCESSFUL'
const TX_ERROR = 'TX_ERROR'

function createTxChannel({ txObject, contractName, sendArgs = {} }) {
  var persistTxHash

  return eventChannel(emit => {
    const txPromiEvent = txObject
      .send(sendArgs)
      .on('transactionHash', txHash => {
        persistTxHash = txHash

        emit({ type: TX_BROADCASTED, txHash })
        emit({ type: 'CONTRACT_SYNC_IND', contractName })
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        emit({
          type: TX_CONFIRMAITON,
          confirmationNumber: confirmationNumber,
          confirmationReceipt: receipt,
          txHash: persistTxHash,
        })
      })
      .on('receipt', receipt => {
        emit({ type: TX_SUCCESSFUL, receipt: receipt, txHash: persistTxHash })
        emit(END)
      })
      .on('error', error => {
        emit({ type: TX_ERROR, error: error, txHash: persistTxHash })
        emit(END)
      })

    const unsubscribe = () => {
      txPromiEvent.off()
    }

    return unsubscribe
  })
}

// sagas
function* loginRequested({ user }) {
  const drizzle = yield getContext('drizzle')
  console.log('LOGIN REQUESTED')
  let userTest = yield isUser(user.address)

  if (userTest) {
    try {
      let tmpUser = yield drizzle.contracts.InkDrop.methods.getUser(user.address).call()
      let userDrops = parseInt(user.drops, 10) >= 0 ? parseInt(user.drops, 10) / 100 : 0
      let newUser = {
        name: drizzle.web3.utils.toUtf8(tmpUser.username),
        bio: tmpUser.bio,
        drops: userDrops,
        address: user.address,
        ipfsHash: tmpUser.ipfsHash,
        imgUrl: `https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
        followers: parseInt(tmpUser.followers, 10),
      }
      // update store
      yield put({
        type: USER_LOGGED_IN,
        payload: newUser,
      })
      // change route to newsfeed (or to redirect url)
      let currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query) {
        yield browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      yield browserHistory.push('/newsfeed')
    } catch (error) {}
  } else {
    yield browserHistory.push('/signup')
  }
}

function* isUser(address) {
  const drizzle = yield getContext('drizzle')
  return yield drizzle.contracts.InkDrop.methods.isUser(address).call()
}

function* signupRequested({ user }) {
  yield put({
    type: USER_LOGGED_IN,
    payload: user,
  })
}

function* logoutRequested(action) {
  console.log('LOGOUT REQUESTED')
  yield put({ type: USER_LOGGED_OUT })
  yield browserHistory.push('/')
}

function* userUpdateRequested({ user }) {
  yield put({
    type: USER_UPDATED,
    payload: user,
  })
}

// register sagas
function* userSagas() {
  yield takeEvery(LOGIN_REQUESTED, loginRequested)
  yield takeEvery(LOGOUT_REQUESTED, logoutRequested)
  yield takeEvery(SIGNUP_REQUESTED, signupRequested)
  yield takeEvery(USERUPDATE_REQUESTED, userUpdateRequested)
}

export default userSagas
