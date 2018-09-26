import { take, put, call, all, fork, takeEvery, select, getContext } from 'redux-saga/effects'
import { eventChannel, END, delay } from 'redux-saga'
import {
  MESSAGE_GOT,
  MESSAGES_GOT,
  MESSAGE_POSTED,
  COMMENT_POSTED,
  UPDATE_MESSAGE,
  UPDATE_COMMENT,
  UPDATE_MESSAGE_COMMENTS,
  USER_MESSAGE_GOT,
  USER_PAGE_GOT,
  USER_MESSAGE_UPDATE,
  UPDATE_USER_MESSAGE_COMMENTS,
  USER_MESSAGE_RESET,
  MESSAGES_PAGINATION,
  MESSAGES_SORTED,
} from './messagesReducer'
import { USER_DROPPED } from '../user/userReducer'
import { roundFloat3 } from '../utils/rounder'

// saga actions
export const MESSAGES_FETCH_REQUESTED = 'MESSAGES_FETCH_REQUESTED'
export const MESSAGE_REQUESTED = 'MESSAGE_REQUESTED'
export const COMMENT_REQUESTED = 'COMMENT_REQUESTED'
export const MESSAGE_DROP_REQUESTED = 'MESSAGE_DROP_REQUESTED'
export const USER_MESSAGES_FETCH_REQUESTED = 'USER_MESSAGES_FETCH_REQUESTED'
export const USER_MESSAGES_RESET_REQUESTED = 'USER_MESSAGES_RESET_REQUESTED'

export const MESSAGES_SORT_REQUESTED = 'MESSAGES_SORT_REQUESTED'

// drizzle's transactions events
const TX_CONFIRMAITON = 'TX_CONFIRMAITON'
const TX_BROADCASTED = 'TX_BROADCASTED'
const TX_SUCCESSFUL = 'TX_SUCCESSFUL'
const TX_ERROR = 'TX_ERROR'

const PAGINATION_ITEMS = 10

// selectors
const getUserAdr = state => state.accounts[0]
const getMessagesTotal = state => state.messages.total
const getMessagesLength = state => state.messages.data.length

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

function* messageRequested({ msg }) {
  const drizzle = yield getContext('drizzle')
  // pre-cache message to store
  let newMsg = Object.assign(
    {},
    {
      ...msg,
      sendingMessage: 'Transaction Pending - Confirm through Metamask',
      drops: roundFloat3(msg.drops),
    }
  )

  yield put({ type: MESSAGE_POSTED, payload: newMsg })
  let count = yield select(getMessagesTotal)
  yield put({ type: MESSAGES_GOT, payload: ++count })

  const contractName = 'InkDrop'

  const sendArgs = {
    value: drizzle.web3.utils.toWei(`${msg.drops}`, 'ether'),
  }

  const txObject = yield call(drizzle.contracts.InkDrop.methods.createMessage, msg.content)
  const txChannel = yield call(createTxChannel, { txObject, contractName, sendArgs })

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
        newMsg.fromBlockchain = true
        newMsg.sendingMessage = ''
        yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      } else if (event.type === TX_ERROR) {
        console.log('ERROR')
        // yield put({ type: DELETE_MESSAGE, payload: msg })
        newMsg.error = 'Transaction failed'
        newMsg.sendingMessage = ''
        yield put({ type: UPDATE_MESSAGE, payload: newMsg })
        yield delay(4000)
        newMsg.error = ''
        yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      }
    }
  } finally {
    console.log('TX CHANNEL CLOSED')
    txChannel.close()
  }
}

// TODO: cleanup code here
function* commentRequested({ comment }) {
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
        yield delay(4000)
        comment.error = ''
        yield put({ type: UPDATE_MESSAGE, payload: comment })
      }
    }
  } finally {
    console.log('TX CHANNEL CLOSED')
    txChannel.close()
  }
}

function* messageDropRequested({ msg, drops }) {
  const drizzle = yield getContext('drizzle')
  console.log('DROP SAGA Here')
  let newMsg = Object.assign({}, msg, {
    drops: roundFloat3(msg.drops + drops),
  })
  newMsg.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: UPDATE_MESSAGE, payload: newMsg })
  // update user & reduce his drops
  // check if user is author of the message. If yes, give him 50% of the drops
  let userAdr = yield select(getUserAdr)
  let userShare = 0
  if (userAdr === msg.userAdr) {
    userShare = 0.5 * drops
    yield put({ type: USER_DROPPED, payload: userShare })
  }

  const contractName = 'InkDrop'
  const sendArgs = { value: drizzle.web3.utils.toWei(`${drops}`, 'ether') }

  const txObject = yield call(drizzle.contracts.InkDrop.methods.dropMessage, msg.id)
  const txChannel = yield call(createTxChannel, { txObject, contractName, sendArgs })

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
        // update user & give back drops used in case of author == dropper
        if (userAdr === msg.userAdr) {
          yield put({ type: USER_DROPPED, payload: -userShare })
        }
        yield delay(4000)
        msg.error = ''
        yield put({ type: UPDATE_MESSAGE, payload: msg })
      }
    }
  } finally {
    console.log('TX CHANNEL CLOSED')
    txChannel.close()
  }
}

function* messagesFetchRequested({ items }) {
  console.log('FETCH MESSAGES')
  const drizzle = yield getContext('drizzle')
  try {
    let count = yield call(drizzle.contracts.InkDrop.methods.getMessageCount().call)
    // update store with total number of messages
    yield put({ type: MESSAGES_GOT, payload: count })
    // get messages length from store
    let msgsLength = yield select(getMessagesLength)
    // do not procede if all messages are already loaded
    // and stop as well if some messages added to the store in the meantime
    if (items !== count && msgsLength < count) {
      yield put({ type: MESSAGES_PAGINATION, payload: { items: items } })
      let newItems = items + PAGINATION_ITEMS >= count ? count : items + PAGINATION_ITEMS
      let maxItems = count - items
      let minItems = count - newItems

      let arr = []
      for (let i = maxItems - 1; i >= minItems; --i) {
        arr.push(fork(getMessageCall, i))
      }
      yield all(arr)

      yield delay(2000)

      yield put({
        type: MESSAGES_PAGINATION,
        payload: { items: newItems, hasMore: true },
      })
    } else if (items === count) {
      yield put({
        type: MESSAGES_PAGINATION,
        payload: { items: items, hasMore: false },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// NEW NEW NEW
function* getMessageCall(msgIndex) {
  const drizzle = yield getContext('drizzle')
  try {
    // get the msgId for the msgIndex first
    let msgId = yield call(drizzle.contracts.InkDrop.methods.getMessageIdAtIndex(msgIndex).call)
    // get the message by its id
    let tmpMsg = yield call(drizzle.contracts.InkDrop.methods.getMessage(msgId).call)
    let msg = yield parseMessage(msgId, tmpMsg)
    // update the store so the UI get updated
    yield put({ type: MESSAGE_GOT, payload: msg })
    yield all([fork(getUser, msg), fork(getComments, msg)])
  } catch (error) {
    console.log(error)
  }
}

// OLD
// function* getMessageCall(msgId) {
//   const drizzle = yield getContext('drizzle')
//   try {
//     // get the message by its id
//     let tmpMsg = yield call(drizzle.contracts.InkDrop.methods.getMessage(msgId).call)
//     let msg = yield parseMessage(msgId, tmpMsg)
//     // update the store so the UI get updated
//     yield put({ type: MESSAGE_GOT, payload: msg })
//     yield all([fork(getUser, msg), fork(getComments, msg)])
//   } catch (error) {
//     console.log(error)
//   }
// }

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
  const drizzle = yield getContext('drizzle')
  try {
    let comment = yield call(drizzle.contracts.InkDrop.methods.getComment(commentId).call)
    let newComment = yield parseComment(commentId, comment)
    let user = yield call(drizzle.contracts.InkDrop.methods.getUser(comment.writtenBy).call)
    let newUser = yield parseUser(commentId, user)
    yield put({
      type: UPDATE_MESSAGE_COMMENTS,
      id: msgId,
      payload: [Object.assign(newComment, newUser)],
    })
  } catch (error) {
    console.log(error)
  }
}

function* parseMessage(id, msg) {
  const drizzle = yield getContext('drizzle')

  return {
    id: id,
    content: msg.content,
    username: '', // drizzle.web3.utils.toUtf8(msg.username),
    timestamp: new Date(msg.timestamp * 1000),
    timetolive: new Date(msg.timetolive * 1000),
    likes: parseInt(msg.likes, 10),
    drops: roundFloat3(drizzle.web3.utils.fromWei(msg.drops, 'ether')), // parseInt(msg.drops, 10) / 100,
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

function* parseComment(id, comment) {
  const drizzle = yield getContext('drizzle')
  return {
    id: id,
    content: comment.content,
    // TODO: call this.context.drizzle.web3.utils.toUtf8 to format username
    username: '', // drizzle.web3.utils.toUtf8(msg.username),
    timestamp: new Date(comment.timestamp * 1000),
    timetolive: new Date(comment.timetolive * 1000),
    likes: parseInt(comment.likes, 10),
    drops: roundFloat3(drizzle.web3.utils.fromWei(comment.drops, 'ether')), //parseInt(comment.drops, 10) / 100,
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
    userUrl: user.ipfsHash.length > 0 ? `https://gateway.ipfs.io/ipfs/${user.ipfsHash}` : '',
  }
}

function* parseCompleteUser(user) {
  const drizzle = yield getContext('drizzle')
  return {
    username: drizzle.web3.utils.toUtf8(user.username),
    userUrl: user.ipfsHash.length > 0 ? `https://gateway.ipfs.io/ipfs/${user.ipfsHash}` : '',
    drops: roundFloat3(drizzle.web3.utils.fromWei(user.drops, 'ether')), //parseInt(user.drops, 10) / 100,
    bio: user.bio,
    followers: parseInt(user.followers, 10),
    messageIds: user.messages.map(function(e) {
      return parseInt(e, 10)
    }),
    messages: [],
  }
}

function* userMessagesFetchRequested({ address }) {
  console.log('FETCH USER MESSAGES: ' + address)
  const drizzle = yield getContext('drizzle')
  try {
    let tmpUser = yield call(drizzle.contracts.InkDrop.methods.getUser(address).call)
    let user = yield parseCompleteUser(tmpUser)

    yield put({
      type: USER_PAGE_GOT,
      payload: user,
    })

    let arr = []
    for (let i = user.messageIds.length - 1; i >= 0; --i) {
      arr.push(fork(getUserMessageCall, user.messageIds[i]))
    }
    yield all(arr)
  } catch (error) {
    console.log(error)
  }
}

function* getUserMessageCall(msgId) {
  const drizzle = yield getContext('drizzle')
  try {
    let tmpMsg = yield call(drizzle.contracts.InkDrop.methods.getMessage(msgId).call)
    let msg = yield parseMessage(msgId, tmpMsg)
    // update the store so the UI get updated
    yield put({ type: USER_MESSAGE_GOT, payload: msg })
    yield all([fork(getUserpageUser, msg), fork(getUserComments, msg)])
  } catch (error) {
    console.log(error)
  }
}

function* getUserComments(msg) {
  let arr = []
  for (let commentId of msg.commentIds) {
    arr.push(fork(getUserComment, msg.id, commentId))
  }
  yield all(arr)
}

function* getUserpageUser(msg) {
  const drizzle = yield getContext('drizzle')
  try {
    let user = yield call(drizzle.contracts.InkDrop.methods.getUser(msg.userAdr).call)
    let newMsg = yield parseUser(msg.id, user)
    yield put({ type: USER_MESSAGE_UPDATE, payload: newMsg })
  } catch (error) {
    console.log(error)
  }
}

function* getUserComment(msgId, commentId) {
  const drizzle = yield getContext('drizzle')
  try {
    let comment = yield call(drizzle.contracts.InkDrop.methods.getComment(commentId).call)
    let newComment = yield parseComment(commentId, comment)
    let user = yield call(drizzle.contracts.InkDrop.methods.getUser(comment.writtenBy).call)
    let newUser = yield parseUser(commentId, user)
    yield put({
      type: UPDATE_USER_MESSAGE_COMMENTS,
      id: msgId,
      payload: [Object.assign(newComment, newUser)],
    })
  } catch (error) {
    console.log(error)
  }
}

function* userMessagesResetRequested() {
  console.log('RESET USER MESSAGES')
  yield put({ type: USER_MESSAGE_RESET })
}

function* messagesSortRequested() {
  const drizzle = yield getContext('drizzle')
  try {
    yield call(drizzle.contracts.InkDrop.methods.sort().send)
    yield put({ type: MESSAGES_SORTED })
  } catch (error) {
    console.log(error)
  }
}

// register sagas
function* messagesSaga() {
  yield takeEvery(MESSAGES_FETCH_REQUESTED, messagesFetchRequested)
  yield takeEvery(MESSAGE_REQUESTED, messageRequested)
  yield takeEvery(COMMENT_REQUESTED, commentRequested)
  yield takeEvery(MESSAGE_DROP_REQUESTED, messageDropRequested)
  yield takeEvery(USER_MESSAGES_FETCH_REQUESTED, userMessagesFetchRequested)
  yield takeEvery(USER_MESSAGES_RESET_REQUESTED, userMessagesResetRequested)
  yield takeEvery(MESSAGES_SORT_REQUESTED, messagesSortRequested)
}

export default messagesSaga
