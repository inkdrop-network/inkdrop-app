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
const MESSAGE_POSTED = 'MESSAGE_POSTED'
const MESSAGE_COUNT_GOT = 'MESSAGE_COUNT_GOT'
const MESSAGE_GOT = 'MESSAGE_GOT'
const MESSAGE_TX_SUCCESS = 'MESSAGE_TX_SUCCESS'
const COMMENT_TX_SUCCESS = 'COMMENT_TX_SUCCESS'
const COMMENT_POSTED = 'COMMENT_POSTED'

// selectors
const getState = state => state
const getTxStack = state => state.transactionStack
const getTxs = state => state.transactions
const getMsgs = state => state.contracts.InkDrop.getMessage

// sagas
function* createMessage(action) {
  yield put({
    type: MESSAGE_POSTED,
    payload: action.payload,
  })
}

function* gotMessageCount(action) {
  yield put({
    type: MESSAGE_COUNT_GOT,
    payload: action.payload,
  })
}

function* gotMessage(action) {
  yield put({
    type: MESSAGE_GOT,
    payload: action.payload,
  })
}

function* successMessageTx(action) {
  yield put({
    type: MESSAGE_TX_SUCCESS,
    payload: action.payload,
  })
}

function* successCommentTx(action) {
  yield put({
    type: COMMENT_TX_SUCCESS,
    payload: action.payload,
  })
}

function* createComment(action) {
  yield put({
    type: COMMENT_POSTED,
    payload: action.payload,
  })
}

// TODO: cleanup code here
function* handleTransaction({ msg }) {
  const drizzle = yield getContext('drizzle')
  console.log('SAGA Here')
  let txId = yield call(
    drizzle.contracts.InkDrop.methods.createMessage.cacheSend,
    msg.content,
    msg.drops
  )
  let txComplete = false

  while (!txComplete) {
    // wait until something happens
    const { confirmation, broadcasted, success, error } = yield race({
      confirmation: take('TX_CONFIRMAITON'),
      broadcasted: take('TX_BROADCASTED'),
      success: take('TX_SUCCESSFUL'),
      error: take('TX_ERROR'),
    })

    if (broadcasted) {
      console.log('1 - BROADCASTED')
      // TODO: add message to store
      yield put({ type: 'MESSAGE_POSTED', payload: msg })
      txComplete = false
    } else if (confirmation) {
      console.log('2 - CONFIRMATION')
      // console.lof(confirmation)
      // TODO: show the confirmation number in the frontend
      // yield put({ type: 'UPDATE_MESSAGE', id: msg.id, payload: msg })
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
      yield put({ type: 'UPDATE_MESSAGE', id: oldMsgId, payload: msg })
      txComplete = txHash && state.transactions[txHash].status === 'success'
    } else if (error) {
      console.log('ERROR')
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
}

// function* getMessage(msgId) {
//   console.log('GET MESSAGE id: ', msgId)
//   const drizzle = yield getContext('drizzle')
//   let argsHash = yield call(drizzle.contracts.InkDrop.methods.getMessage.cacheCall, msgId)
//   let reqComplete = false
//   while (!reqComplete) {
//     const { success, error } = yield race({
//       success: take('GOT_CONTRACT_VAR'),
//       error: take('ERROR_CONTRACT_VAR'),
//     })
//     if (success) {
//       console.log('SUCCESS')
//       let msgs = yield select(getMsgs)
//       if (argsHash in msgs) {
//         let msg = yield msgs[argsHash]
//         console.log(msg)
//         // let newMsg = parseMessage(msgId, msg)
//         // update the store so the UI get updated
//         // yield put({ type: 'MESSAGE_GOT', payload: newMsg })
//       }
//     } else if (error) {
//       console.log('ERROR')
//     }
//   }
// }

function* getMessageCall(msgId) {
  // TODO: try and catch
  console.log('GET MESSAGE id: ', msgId)
  const drizzle = yield getContext('drizzle')
  let tmpMsg = yield call(drizzle.contracts.InkDrop.methods.getMessage(msgId).call)
  let msg = parseMessage(msgId, tmpMsg)
  // update the store so the UI get updated
  yield put({ type: 'MESSAGE_GOT', payload: msg })
  yield all([fork(getUser, msg), fork(getComments, msg)])
}

function* getComments(msg) {
  let arr = []
  for (let commentId of msg.commentIds) {
    arr.push(fork(getComment, msg.id, commentId))
  }
  let comments = yield all(arr)
  // yield put({ type: 'UPDATE_MESSAGE', id: msg.id, payload: { initialized: true } })
}

function* getUser(msg) {
  console.log('GET USER: ', msg.id)
  const drizzle = yield getContext('drizzle')
  try {
    let user = yield call(drizzle.contracts.InkDrop.methods.getUser(msg.userAdr).call)
    let newMsg = yield parseUser(msg.id, user)
    yield put({ type: 'UPDATE_MESSAGE', id: msg.id, payload: newMsg })
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
    type: 'UPDATE_MESSAGE_COMMENTS',
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
  yield takeLatest('MESSAGE_REQUESTED', handleTransaction)
  yield takeLatest('MESSAGE_COUNT_REQUESTED', gotMessageCount)
  yield takeLatest('MESSAGE_FETCH_REQUESTED', gotMessage)
  yield takeLatest('MESSAGES_FETCH_REQUESTED', getMessages)
  yield takeLatest('MESSAGE_TX_REQUESTED', successMessageTx)
  yield takeLatest('COMMENT_TX_REQUESTED', successCommentTx)
  yield takeLatest('COMMENT_REQUESTED', createComment)
}

export default messagesSaga
