import { call, put, takeEvery, getContext, select, take } from 'redux-saga/effects'
import { eventChannel, END, delay } from 'redux-saga'
import { browserHistory } from 'react-router'
import { USER_LOGGED_IN, USER_LOGGED_OUT, USER_UPDATED, USER_SIGNUP } from './userReducer'
import ipfs from '../ipfs'

// saga actions actions
const LOGIN_REQUESTED = 'LOGIN_REQUESTED'
const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED'
const SIGNUP_REQUESTED = 'SIGNUP_REQUESTED'
// const IPFS_UPLOAD_REQUESTED = 'IPFS_UPLOAD_REQUESTED'
const USERUPDATE_REQUESTED = 'USERUPDATE_REQUESTED'

// drizzle's transactions events
const TX_CONFIRMAITON = 'TX_CONFIRMAITON'
const TX_BROADCASTED = 'TX_BROADCASTED'
const TX_SUCCESSFUL = 'TX_SUCCESSFUL'
const TX_ERROR = 'TX_ERROR'

// selectors
const getIpfs = state => state.user.signup.ipfsHash

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
      let tmpUser = yield call(drizzle.contracts.InkDrop.methods.getUser(user.address).call)
      let userDrops = parseInt(tmpUser.drops, 10) >= 0 ? parseInt(tmpUser.drops, 10) / 100 : 0
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
  return yield call(drizzle.contracts.InkDrop.methods.isUser(address).call)
}

function* ipfsUploadRequested({ buffer }) {
  console.log('IPFS UPLOAD REQUESTED')
  try {
    yield put({
      type: USER_SIGNUP,
      payload: {
        sendingMessage: 'Uploading image to IPFS - Please wait',
      },
    })
    let ipfsHash = yield call(ipfs.add, buffer)
    yield put({
      type: USER_SIGNUP,
      payload: {
        ipfsHash: ipfsHash[0].hash,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

function* signupRequested({ user, buffer }) {
  const drizzle = yield getContext('drizzle')
  console.log('SIGNUP REQUESTED')

  let userTest = yield isUser(user.address)

  if (!userTest) {
    // upload image to ipfs
    yield call(ipfsUploadRequested, { buffer })
    let ipfsHash = yield select(getIpfs)
    // show message in the UI
    yield put({
      type: USER_SIGNUP,
      payload: {
        ipfsHash: ipfsHash,
        sendingMessage: 'Transaction Pending - Confirm through Metamask',
      },
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
            type: USER_SIGNUP,
            payload: {
              sendingMessage: 'Submitting transaction to blockchain',
            },
          })
        } else if (event.type === TX_CONFIRMAITON) {
          console.log('2 - CONFIRMATION')
          // TODO: show the confirmation number in the frontend
        } else if (event.type === TX_SUCCESSFUL) {
          console.log('3 - SUCCESS')
          let newUser = {
            name: user.name,
            bio: user.bio,
            // the initial 10 drops
            drops: 10,
            address: user.address,
            ipfsHash: ipfsHash,
            imgUrl: `https://gateway.ipfs.io/ipfs/${ipfsHash}`,
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
          }

          yield browserHistory.push('/newsfeed')
        } else if (event.type === TX_ERROR) {
          console.log('ERROR')
          yield put({
            type: USER_SIGNUP,
            payload: {
              sendingMessage: '',
              error: 'Transaction failed. Please try again.',
            },
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
      type: USER_SIGNUP,
      payload: {
        sendingMessage: 'You already have an account. Logging in now.',
      },
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
  // yield takeEvery(IPFS_UPLOAD_REQUESTED, ipfsUploadRequested)
  yield takeEvery(USERUPDATE_REQUESTED, userUpdateRequested)
}

export default userSagas
