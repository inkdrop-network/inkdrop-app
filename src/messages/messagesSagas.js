import {
  take,
  put,
  call,
  all,
  fork,
  takeLatest,
  race,
  select,
  getContext,
} from 'redux-saga/effects'

// actions
const MESSAGES_GOT = 'MESSAGES_GOT'
const MESSAGE_GOT = 'MESSAGE_GOT'
const MESSAGE_POSTED = 'MESSAGE_POSTED'
const COMMENT_POSTED = 'COMMENT_POSTED'

const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
const UPDATE_COMMENT = 'UPDATE_COMMENT'
const UPDATE_MESSAGE_COMMENTS = 'UPDATE_MESSAGE_COMMENTS'

const DELETE_MESSAGE = 'DELETE_MESSAGE'
const DELETE_COMMENT = 'DELETE_COMMENT'

// drizzle's transactions events
const TX_CONFIRMAITON = 'TX_CONFIRMAITON'
const TX_BROADCASTED = 'TX_BROADCASTED'
const TX_SUCCESSFUL = 'TX_SUCCESSFUL'
const TX_ERROR = 'TX_ERROR'

// selectors
const getState = state => state
// const getTxStack = state => state.transactionStack
// const getTxs = state => state.transactions
// const getMsgs = state => state.contracts.InkDrop.getMessage

// TODO: cleanup code here
function* handleMsgTransaction({ msg }) {
  const drizzle = yield getContext('drizzle')
  console.log('SAGA Here')
  msg.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: MESSAGE_POSTED, payload: msg })
  let txId = yield call(
    drizzle.contracts.InkDrop.methods.createMessage.cacheSend,
    msg.content,
    msg.drops
  )
  let txComplete = false

  while (!txComplete) {
    // wait until something happens
    const { confirmation, broadcasted, success, error } = yield race({
      confirmation: take(TX_CONFIRMAITON),
      broadcasted: take(TX_BROADCASTED),
      success: take(TX_SUCCESSFUL),
      error: take(TX_ERROR),
    })

    if (broadcasted) {
      console.log('1 - BROADCASTED')
      msg.sendingMessage = 'Submitting transaction to blockchain'
      yield put({ type: UPDATE_MESSAGE, payload: msg })
      txComplete = false
    } else if (confirmation) {
      console.log('2 - CONFIRMATION')
      // TODO: show the confirmation number in the frontend
      txComplete = false
    } else if (success) {
      console.log('3 - SUCCESS')
      let state = yield select(getState)
      let txHash = state.transactionStack[txId]
      // TODO: change message in store to fromBlockchain=true and id=argsHash
      let argsHash = yield call(drizzle.contracts.InkDrop.methods.getMessage.cacheCall, msg.id)
      let oldMsgId = msg.id
      // msg.id = argsHash
      msg.fromBlockchain = true
      msg.sendingMessage = ''
      yield put({ type: UPDATE_MESSAGE, payload: msg })
      txComplete = txHash && state.transactions[txHash].status === 'success'
    } else if (error) {
      console.log('ERROR')
      // yield put({ type: DELETE_MESSAGE, payload: msg })
      msg.error = 'Transaction failed'
      msg.sendingMessage = ''
      yield put({ type: UPDATE_MESSAGE, payload: msg })
    }
  }

  console.log('4 - AFTER')
}

// TODO: cleanup code here
function* handleCommTransaction({ comment }) {
  const drizzle = yield getContext('drizzle')
  console.log('SAGA Here')
  comment.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: COMMENT_POSTED, payload: comment })

  let txId = yield call(
    drizzle.contracts.InkDrop.methods.createComment.cacheSend,
    comment.parent,
    comment.content
  )
  let txComplete = false

  while (!txComplete) {
    // wait until something happens
    const { confirmation, broadcasted, success, error } = yield race({
      confirmation: take(TX_CONFIRMAITON),
      broadcasted: take(TX_BROADCASTED),
      success: take(TX_SUCCESSFUL),
      error: take(TX_ERROR),
    })

    if (broadcasted) {
      console.log('1 - BROADCASTED')
      comment.sendingMessage = 'Submitting transaction to blockchain'
      yield put({ type: UPDATE_COMMENT, payload: comment })
      txComplete = false
    } else if (confirmation) {
      console.log('2 - CONFIRMATION')
      // TODO: show the confirmation number in the frontend
      // yield put({ type: 'UPDATE_MESSAGE', id: msg.id, payload: msg })
      txComplete = false
    } else if (success) {
      console.log('3 - SUCCESS')
      let state = yield select(getState)
      let txHash = state.transactionStack[txId]
      // TODO: change message in store to fromBlockchain=true and id=argsHash
      let argsHash = yield call(drizzle.contracts.InkDrop.methods.getMessage.cacheCall, comment.id)
      let oldMsgId = comment.id
      // msg.id = argsHash
      comment.fromBlockchain = true
      comment.sendingMessage = ''
      yield put({ type: UPDATE_COMMENT, payload: comment })
      txComplete = txHash && state.transactions[txHash].status === 'success'
    } else if (error) {
      console.log('ERROR')
      comment.error = 'Transaction failed'
      comment.sendingMessage = ''
      yield put({ type: UPDATE_COMMENT, payload: comment })
    }
  }

  console.log('4 - AFTER')
}

// TODO: cleanup code here
function* handleLikeTransaction({ msg }) {
  const drizzle = yield getContext('drizzle')
  console.log('LIKE SAGA Here')
  let newMsg = Object.assign({}, msg, {
    likes: msg.likes + 1,
  })
  newMsg.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: UPDATE_MESSAGE, payload: newMsg })
  let txId = yield call(drizzle.contracts.InkDrop.methods.likeMessage.cacheSend, msg.id)
  let txComplete = false

  while (!txComplete) {
    // wait until something happens
    const { confirmation, broadcasted, success, error } = yield race({
      confirmation: take(TX_CONFIRMAITON),
      broadcasted: take(TX_BROADCASTED),
      success: take(TX_SUCCESSFUL),
      error: take(TX_ERROR),
    })

    if (broadcasted) {
      console.log('1 - BROADCASTED')
      // TODO: add message to store
      newMsg.sendingMessage = 'Submitting transaction to blockchain'
      yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      txComplete = false
    } else if (confirmation) {
      console.log('2 - CONFIRMATION')
      // TODO: show the confirmation number in the frontend
      txComplete = false
    } else if (success) {
      console.log('3 - SUCCESS')
      let state = yield select()
      let txHash = state.transactionStack[txId]
      // TODO: change message in store to fromBlockchain=true and id=argsHash
      // let argsHash = yield call(drizzle.contracts.InkDrop.methods.getMessage.cacheCall, msg.id)
      // let oldMsgId = msg.id
      // msg.id = argsHash
      // msg.fromBlockchain = true
      // yield put({ type: UPDATE_MESSAGE, id: oldMsgId, payload: msg })
      newMsg.sendingMessage = ''
      yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      txComplete = txHash && state.transactions[txHash].status === 'success'
    } else if (error) {
      console.log('ERROR')
      msg.error = 'Transaction failed'
      yield put({ type: UPDATE_MESSAGE, payload: msg })
    }
  }

  console.log('4 - AFTER')
}

// TODO: cleanup code here
function* handleDropTransaction({ msg, drops }) {
  const drizzle = yield getContext('drizzle')
  console.log('DROP SAGA Here')
  let newMsg = Object.assign({}, msg, {
    drops: msg.drops + drops,
  })
  newMsg.sendingMessage = 'Transaction Pending - Confirm through Metamask'
  yield put({ type: UPDATE_MESSAGE, payload: newMsg })
  let txId = yield call(drizzle.contracts.InkDrop.methods.dropMessage.cacheSend, msg.id, msg.drops)
  let txComplete = false

  while (!txComplete) {
    // wait until something happens
    const { confirmation, broadcasted, success, error } = yield race({
      confirmation: take(TX_CONFIRMAITON),
      broadcasted: take(TX_BROADCASTED),
      success: take(TX_SUCCESSFUL),
      error: take(TX_ERROR),
    })

    if (broadcasted) {
      console.log('1 - BROADCASTED')
      // TODO: add message to store
      newMsg.sendingMessage = 'Submitting transaction to blockchain'
      yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      txComplete = false
    } else if (confirmation) {
      console.log('2 - CONFIRMATION')
      // TODO: show the confirmation number in the frontend
      txComplete = false
    } else if (success) {
      console.log('3 - SUCCESS')
      let state = yield select()
      let txHash = state.transactionStack[txId]
      // TODO: change message in store to fromBlockchain=true and id=argsHash
      // let argsHash = yield call(drizzle.contracts.InkDrop.methods.getMessage.cacheCall, msg.id)
      // let oldMsgId = msg.id
      // msg.id = argsHash
      // msg.fromBlockchain = true
      // yield put({ type: UPDATE_MESSAGE, id: oldMsgId, payload: msg })
      newMsg.sendingMessage = ''
      yield put({ type: UPDATE_MESSAGE, payload: newMsg })
      txComplete = txHash && state.transactions[txHash].status === 'success'
    } else if (error) {
      console.log('ERROR')
      msg.error = 'Transaction failed'
      yield put({ type: UPDATE_MESSAGE, payload: msg })
    }
  }

  console.log('4 - AFTER')
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
  console.log('GET MESSAGE id: ', msgId)
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
  let comments = yield all(arr)
}

function* getUser(msg) {
  console.log('GET USER: ', msg.id)
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
  console.log('GET COMMENT: ', msgId, commentId)
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
  yield takeLatest('MESSAGES_FETCH_REQUESTED', getMessages)
  yield takeLatest('MESSAGE_REQUESTED', handleMsgTransaction)
  yield takeLatest('COMMENT_REQUESTED', handleCommTransaction)
  yield takeLatest('MESSAGE_DROP_REQUESTED', handleDropTransaction)
  yield takeLatest('MESSAGE_LIKE_REQUESTED', handleLikeTransaction)
}

export default messagesSaga
