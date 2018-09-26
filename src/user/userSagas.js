import { call, put, takeEvery, getContext, select, take } from 'redux-saga/effects'
import { eventChannel, END, delay } from 'redux-saga'
import { browserHistory } from 'react-router'
import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_UPDATED,
  USER_ERR_TX_RESET,
  USER_TX_MSG,
  USER_ERROR,
  USER_PAYOUT,
  USER_TOUR,
} from './userReducer'
import { roundFloat3 } from '../utils/rounder'
import ipfs from '../ipfs'

// saga actions actions
export const LOGIN_REQUESTED = 'LOGIN_REQUESTED'
export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED'
export const SIGNUP_REQUESTED = 'SIGNUP_REQUESTED'
// const IPFS_UPLOAD_REQUESTED = 'IPFS_UPLOAD_REQUESTED'
export const USERUPDATE_REQUESTED = 'USERUPDATE_REQUESTED'
export const USERFOLLOW_REQUESTED = 'USERFOLLOW_REQUESTED'
export const USERUNFOLLOW_REQUESTED = 'USERFOLLOW_REQUESTED'
export const USER_PAYOUT_REQUESTED = 'USER_PAYOUT_REQUESTED'

// drizzle's transactions events
export const TX_CONFIRMAITON = 'TX_CONFIRMAITON'
export const TX_BROADCASTED = 'TX_BROADCASTED'
export const TX_SUCCESSFUL = 'TX_SUCCESSFUL'
export const TX_ERROR = 'TX_ERROR'

// selectors
const getUser = state => state.user.data
const getUserDrops = state => state.user.data.drops

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
  yield put({ type: USER_ERR_TX_RESET })
  let userTest = yield isUser(user.address)

  if (userTest) {
    try {
      let tmpUser = yield call(drizzle.contracts.InkDrop.methods.getUser(user.address).call)
      // let userDrops = parseInt(tmpUser.drops, 10) >= 0 ? parseInt(tmpUser.drops, 10) / 100 : 0
      let newUser = {
        name: drizzle.web3.utils.toUtf8(tmpUser.username),
        bio: tmpUser.bio,
        drops: roundFloat3(drizzle.web3.utils.fromWei(tmpUser.drops, 'ether')),
        address: user.address,
        ipfsHash: tmpUser.ipfsHash,
        imgUrl:
          tmpUser.ipfsHash.length > 0 ? `https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}` : '',
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
      } else {
        yield browserHistory.push('/newsfeed')
      }
    } catch (error) {}
  } else {
    yield browserHistory.push('/signup')
  }
}

function* isUser(address) {
  const drizzle = yield getContext('drizzle')
  return yield call(drizzle.contracts.InkDrop.methods.isUser(address).call)
}

function* ipfsUploadRequested({ buffer }) {
  console.log('IPFS UPLOAD REQUESTED')
  try {
    yield put({
      type: USER_TX_MSG,
      payload: 'Uploading image to IPFS - Please wait',
      loading: true,
    })
    let ipfsHash = yield call(ipfs.add, buffer)
    return ipfsHash[0].hash
  } catch (error) {
    console.log(error)
    yield put({
      type: USER_ERROR,
      payload: error.message || 'Something went wrong.',
    })
  }
}

function* signupRequested({ user, buffer }) {
  const drizzle = yield getContext('drizzle')
  console.log('SIGNUP REQUESTED')
  yield put({ type: USER_ERR_TX_RESET })
  let userTest = yield isUser(user.address)

  if (!userTest) {
    // upload image to ipfs
    let ipfsHash = buffer instanceof Buffer ? yield call(ipfsUploadRequested, { buffer }) : ''

    // show message in the UI
    yield put({
      type: USER_TX_MSG,
      payload: 'Transaction Pending - Confirm through Metamask',
      loading: true,
    })

    const contractName = 'InkDrop'
    const args = {
      username: drizzle.web3.utils.fromAscii(user.name),
      bio: user.bio,
      ipfsHash: ipfsHash,
    }
    const txObject = yield call(
      drizzle.contracts.InkDrop.methods.createUser,
      drizzle.web3.utils.fromAscii(user.name),
      user.bio,
      ipfsHash
    )
    const txChannel = yield call(createTxChannel, { txObject, contractName, args })

    try {
      while (true) {
        let event = yield take(txChannel)
        // forward the standard drizzle events
        yield put(event)
        // catch the tx related events and update store
        if (event.type === TX_BROADCASTED) {
          console.log('1 - BROADCASTED')
          yield put({
            type: USER_TX_MSG,
            payload: 'Submitting transaction to blockchain',
            loading: true,
          })
        } else if (event.type === TX_CONFIRMAITON) {
          console.log('2 - CONFIRMATION')
          // TODO: show the confirmation number in the frontend
        } else if (event.type === TX_SUCCESSFUL) {
          console.log('3 - SUCCESS')
          let newUser = {
            name: user.name,
            bio: user.bio,
            drops: 0,
            address: user.address,
            ipfsHash: ipfsHash,
            imgUrl: ipfsHash.length > 0 ? `https://gateway.ipfs.io/ipfs/${ipfsHash}` : '',
            followers: 0,
          }

          yield put({
            type: USER_UPDATED,
            payload: newUser,
          })
          // Used a manual redirect here as opposed to a wrapper.
          // This way, once logged in a user can still access the home page.
          let currentLocation = browserHistory.getCurrentLocation()

          if ('redirect' in currentLocation.query) {
            yield browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
          } else {
            yield browserHistory.push('/newsfeed')
          }
          // Show intro tour
          yield put({
            type: USER_TOUR,
            payload: true,
          })
        } else if (event.type === TX_ERROR) {
          console.log('ERROR')
          yield put({
            type: USER_ERROR,
            payload: event.error.message || 'Something went wrong.',
          })
        }
      }
    } finally {
      console.log('TX CHANNEL CLOSED')
      txChannel.close()
    }
  } else {
    // already user, so forward to login saga
    yield put({
      type: USER_TX_MSG,
      payload: 'You already have an account. Logging in now.',
      loading: true,
    })
    // delay the login in order to show the message to the user
    yield delay(2000)
    yield loginRequested({ user })
  }
}

function* logoutRequested(action) {
  console.log('LOGOUT REQUESTED')
  yield put({ type: USER_LOGGED_OUT })
  yield browserHistory.push('/')
}

function* userUpdateRequested({ user, buffer }) {
  const drizzle = yield getContext('drizzle')
  console.log('USER UPDATE REQUESTED')
  yield put({ type: USER_ERR_TX_RESET })
  // get the current user
  let currentUser = yield select(getUser)
  // merge current user with new info
  let newUser = {
    ...currentUser,
    ...user,
  }
  // update store
  yield put({
    type: USER_UPDATED,
    payload: newUser,
  })
  // upload image to ipfs
  let ipfsHash = buffer instanceof Buffer ? yield call(ipfsUploadRequested, { buffer }) : ''
  // merge ipfsHash with newUser
  newUser = {
    ...newUser,
    ipfsHash: ipfsHash,
    imgUrl: ipfsHash.length > 0 ? `https://gateway.ipfs.io/ipfs/${ipfsHash}` : '',
  }
  // update store
  yield put({
    type: USER_UPDATED,
    payload: newUser,
  })

  const contractName = 'InkDrop'
  const args = {
    username: drizzle.web3.utils.fromAscii(user.name),
    bio: user.bio,
    ipfsHash: ipfsHash,
  }
  const txObject = yield call(
    drizzle.contracts.InkDrop.methods.updateUser,
    drizzle.web3.utils.fromAscii(user.name),
    user.bio,
    ipfsHash
  )
  const txChannel = yield call(createTxChannel, { txObject, contractName, args })

  try {
    while (true) {
      let event = yield take(txChannel)
      // forward the standard drizzle events
      yield put(event)
      // catch the tx related events and update store
      if (event.type === TX_BROADCASTED) {
        console.log('1 - BROADCASTED')
        yield put({
          type: USER_TX_MSG,
          payload: 'Submitting transaction to blockchain',
          loading: true,
        })
      } else if (event.type === TX_CONFIRMAITON) {
        console.log('2 - CONFIRMATION')
        // TODO: show the confirmation number in the frontend
      } else if (event.type === TX_SUCCESSFUL) {
        console.log('3 - SUCCESS')

        yield put({
          type: USER_TX_MSG,
          payload: 'Transaction successfull.',
          loading: false,
        })
        yield delay(3000)
        yield put({ type: USER_ERR_TX_RESET })
      } else if (event.type === TX_ERROR) {
        console.log('ERROR')
        yield put({
          type: USER_ERROR,
          payload: event.error.message || 'Something went wrong.',
        })
        yield put({
          type: USER_UPDATED,
          payload: currentUser,
        })
      }
    }
  } finally {
    console.log('TX CHANNEL CLOSED')
    txChannel.close()
  }
}

function* userPayoutRequested() {
  const drizzle = yield getContext('drizzle')
  let currentDrops = yield select(getUserDrops)
  try {
    // estimate gas because of 'out of gas' possibility with the standard estimation
    let gasAmount = yield call(drizzle.contracts.InkDrop.methods.userPayout().estimateGas)
    yield call(drizzle.contracts.InkDrop.methods.userPayout().send, { gas: gasAmount * 2 })
    yield put({ type: USER_PAYOUT, payload: 0 })
  } catch (error) {
    console.log(error)
    // reset the earned tokens to the initial value
    yield put({ type: USER_PAYOUT, payload: currentDrops })
  }
}

// register sagas
function* userSagas() {
  yield takeEvery(LOGIN_REQUESTED, loginRequested)
  yield takeEvery(LOGOUT_REQUESTED, logoutRequested)
  yield takeEvery(SIGNUP_REQUESTED, signupRequested)
  // yield takeEvery(IPFS_UPLOAD_REQUESTED, ipfsUploadRequested)
  yield takeEvery(USERUPDATE_REQUESTED, userUpdateRequested)
  yield takeEvery(USER_PAYOUT_REQUESTED, userPayoutRequested)
}

export default userSagas
