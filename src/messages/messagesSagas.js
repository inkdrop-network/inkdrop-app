import { take, put, call, all, fork, takeEvery, select, getContext } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import {
  MESSAGES_GOT,
  MESSAGE_GOT,
  MESSAGE_POSTED,
  COMMENT_POSTED,
  UPDATE_MESSAGE,
  UPDATE_COMMENT,
  UPDATE_MESSAGE_COMMENTS,
} from './messagesReducer'
import { USER_DROPPED } from '../user/userReducer'

// saga actions
export const MESSAGES_FETCH_REQUESTED = 'MESSAGES_FETCH_REQUESTED'
export const MESSAGE_REQUESTED = 'MESSAGE_REQUESTED'
export const COMMENT_REQUESTED = 'COMMENT_REQUESTED'
export const MESSAGE_DROP_REQUESTED = 'MESSAGE_DROP_REQUESTED'

// drizzle's transactions events
const TX_CONFIRMAITON = 'TX_CONFIRMAITON'
const TX_BROADCASTED = 'TX_BROADCASTED'
const TX_SUCCESSFUL = 'TX_SUCCESSFUL'
const TX_ERROR = 'TX_ERROR'

// selectors
const getUserAdr = state => state.accounts[0]

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

function* handleMsgTx({ msg }) {
  const drizzle = yield getContext('drizzle')
  // pre-cache message to store
  msg.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: MESSAGE_POSTED, payload: msg })

  const contractName = 'InkDrop'
  const args = {
    content: msg.content,
    drops: msg.drops,
  }
  const txObject = yield call(
    drizzle.contracts.InkDrop.methods.createMessage,
    msg.content,
    msg.drops
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
        msg.sendingMessage = 'Submitting transaction to blockchain'
        yield put({ type: UPDATE_MESSAGE, payload: msg })
      } else if (event.type === TX_CONFIRMAITON) {
        console.log('2 - CONFIRMATION')
        // TODO: show the confirmation number in the frontend
      } else if (event.type === TX_SUCCESSFUL) {
        console.log('3 - SUCCESS')
        msg.fromBlockchain = true
        msg.sendingMessage = ''
        yield put({ type: UPDATE_MESSAGE, payload: msg })
      } else if (event.type === TX_ERROR) {
        console.log('ERROR')
        // yield put({ type: DELETE_MESSAGE, payload: msg })
        msg.error = 'Transaction failed'
        msg.sendingMessage = ''
        yield put({ type: UPDATE_MESSAGE, payload: msg })
      }
    }
  } finally {
    console.log('TX CHANNEL CLOSED')
    txChannel.close()
  }
}

// TODO: cleanup code here
function* handleCommTransaction({ comment }) {
  const drizzle = yield getContext('drizzle')
  console.log('SAGA Here')
  comment.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: COMMENT_POSTED, payload: comment })

  const contractName = 'InkDrop'
  const args = {
    parent: comment.parent,
    content: comment.content,
  }
  const txObject = yield call(
    drizzle.contracts.InkDrop.methods.createComment,
    comment.parent,
    comment.content
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
        comment.sendingMessage = 'Submitting transaction to blockchain'
        yield put({ type: UPDATE_COMMENT, payload: comment })
      } else if (event.type === TX_CONFIRMAITON) {
        console.log('2 - CONFIRMATION')
        // TODO: show the confirmation number in the frontend
        // yield put({ type: 'UPDATE_MESSAGE', id: msg.id, payload: msg })
      } else if (event.type === TX_SUCCESSFUL) {
        console.log('3 - SUCCESS')
        comment.fromBlockchain = true
        comment.sendingMessage = ''
        yield put({ type: UPDATE_COMMENT, payload: comment })
      } else if (event.type === TX_ERROR) {
        console.log('ERROR')
        comment.error = 'Transaction failed'
        comment.sendingMessage = ''
        yield put({ type: UPDATE_COMMENT, payload: comment })
      }
    }
  } finally {
    console.log('TX CHANNEL CLOSED')
    txChannel.close()
  }
}

function* handleDropTransaction({ msg, drops }) {
  const drizzle = yield getContext('drizzle')
  console.log('DROP SAGA Here')
  let newMsg = Object.assign({}, msg, {
    drops: msg.drops + drops,
  })
  newMsg.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: UPDATE_MESSAGE, payload: newMsg })
  // update user & reduce his drops
  // TODO: check if user is author of the message. If yes, give him 50% of the drops
  let userAdr = yield select(getUserAdr)
  let userShare = 0
  if (userAdr === msg.userAdr) {
    userShare = 0.5 * drops
  }
  yield put({ type: USER_DROPPED, payload: drops - userShare })

  const contractName = 'InkDrop'
  const args = { id: msg.id, drops: drops }
  const txObject = yield call(drizzle.contracts.InkDrop.methods.dropMessage, msg.id, drops)
  const txChannel = yield call(createTxChannel, { txObject, contractName, args })

  try {
    while (true) {
      let event = yield take(txChannel)
      // forward the standard drizzle events
      yield put(event)

      // catch the tx related events and update store
      if (event.type === TX_BROADCASTED) {
        console.log('1 - BROADCASTED')
        newMsg.sendingMessage = 'Submitting transaction to blockchain'
        yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      } else if (event.type === TX_CONFIRMAITON) {
        console.log('2 - CONFIRMATION')
        // TODO: show the confirmation number in the frontend
      } else if (event.type === TX_SUCCESSFUL) {
        console.log('3 - SUCCESS')
        newMsg.sendingMessage = ''
        yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      } else if (event.type === TX_ERROR) {
        console.log('ERROR')
        msg.error = 'Transaction failed'
        msg.sendingMessage = ''
        yield put({ type: UPDATE_MESSAGE, payload: msg })
        // update user & give back drops used
        yield put({ type: USER_DROPPED, payload: -(drops - userShare) })
      }
    }
  } finally {
    console.log('TX CHANNEL CLOSED')
    txChannel.close()
  }
}

function* getMessages() {
  // TODO: try and catch
  console.log('FETCH MESSAGES')
  const drizzle = yield getContext('drizzle')
  let count = yield call(drizzle.contracts.InkDrop.methods.getMessageCount().call)
  console.log(count)
  let arr = []
  for (let i = count - 1; i >= 0; --i) {
    arr.push(fork(getMessageCall, i))
  }
  yield all(arr)
  yield put({ type: MESSAGES_GOT, payload: true })
}

function* getMessageCall(msgId) {
  // TODO: try and catch
  const drizzle = yield getContext('drizzle')
  let tmpMsg = yield call(drizzle.contracts.InkDrop.methods.getMessage(msgId).call)
  let msg = parseMessage(msgId, tmpMsg)
  // update the store so the UI get updated
  yield put({ type: MESSAGE_GOT, payload: msg })
  yield all([fork(getUser, msg), fork(getComments, msg)])
}

function* getComments(msg) {
  let arr = []
  for (let commentId of msg.commentIds) {
    arr.push(fork(getComment, msg.id, commentId))
  }
  yield all(arr)
}

function* getUser(msg) {
  const drizzle = yield getContext('drizzle')
  try {
    let user = yield call(drizzle.contracts.InkDrop.methods.getUser(msg.userAdr).call)
    let newMsg = yield parseUser(msg.id, user)
    yield put({ type: UPDATE_MESSAGE, payload: newMsg })
  } catch (error) {
    console.log(error)
  }
}

function* getComment(msgId, commentId) {
  // TODO: try and catch
  const drizzle = yield getContext('drizzle')
  let comment = yield call(drizzle.contracts.InkDrop.methods.getComment(commentId).call)
  let newComment = parseComment(commentId, comment)
  let user = yield call(drizzle.contracts.InkDrop.methods.getUser(comment.writtenBy).call)
  let newUser = yield parseUser(commentId, user)
  yield put({
    type: UPDATE_MESSAGE_COMMENTS,
    id: msgId,
    payload: [Object.assign(newComment, newUser)],
  })
}

function parseMessage(id, msg) {
  return {
    id: id,
    content: msg.content,
    username: '', // drizzle.web3.utils.toUtf8(msg.username),
    timestamp: new Date(msg.timestamp * 1000),
    timetolive: new Date(msg.timetolive * 1000),
    likes: parseInt(msg.likes, 10),
    drops: parseInt(msg.drops, 10) / 100,
    userUrl: '', //`https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
    userAdr: msg.writtenBy,
    commentIds: msg.comments.map(function(e) {
      return parseInt(e, 10)
    }),
    comments: [],
    fromBlockchain: true,
    initialized: false,
  }
}

function parseComment(id, comment) {
  return {
    id: id,
    content: comment.content,
    // TODO: call this.context.drizzle.web3.utils.toUtf8 to format username
    username: '', // drizzle.web3.utils.toUtf8(msg.username),
    timestamp: new Date(comment.timestamp * 1000),
    timetolive: new Date(comment.timetolive * 1000),
    likes: parseInt(comment.likes, 10),
    drops: parseInt(comment.drops, 10) / 100,
    userUrl: '', //`https://gateway.ipfs.io/ipfs/${tmpUser.ipfsHash}`,
    userAdr: comment.writtenBy,
    fromBlockchain: true,
    initialized: false,
  }
}

function* parseUser(id, user) {
  const drizzle = yield getContext('drizzle')
  return {
    id: id,
    username: drizzle.web3.utils.toUtf8(user.username),
    userUrl: `https://gateway.ipfs.io/ipfs/${user.ipfsHash}`,
  }
}

// register sagas
function* messagesSaga() {
  yield takeEvery(MESSAGES_FETCH_REQUESTED, getMessages)
  yield takeEvery(MESSAGE_REQUESTED, handleMsgTx)
  yield takeEvery(COMMENT_REQUESTED, handleCommTransaction)
  yield takeEvery(MESSAGE_DROP_REQUESTED, handleDropTransaction)
}

export default messagesSaga
