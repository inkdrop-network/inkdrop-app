import { take, put, call, takeLatest, race, getContext } from 'redux-saga/effects'

// actions
const MESSAGE_POSTED = 'MESSAGE_POSTED'
const MESSAGE_COUNT_GOT = 'MESSAGE_COUNT_GOT'
const MESSAGE_GOT = 'MESSAGE_GOT'
const MESSAGE_TX_SUCCESS = 'MESSAGE_TX_SUCCESS'
const COMMENT_TX_SUCCESS = 'COMMENT_TX_SUCCESS'
const COMMENT_POSTED = 'COMMENT_POSTED'

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

function* handleTransaction({ fxn, msg }) {
  const drizzle = yield getContext('drizzle')
  console.log('SAGA Here')
  let txId = yield call(fxn.createMessage.cacheSend, msg.content, msg.drops)
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
      // console.log(success)
      //TODO: use a selector!
      let state = yield call(drizzle.store.getState)
      let txHash = state.transactionStack[txId]
      // TODO: change message in store to fromBlockchain=true and id=argsHash
      let argsHash = yield call(fxn.getMessage.cacheCall, msg.id)
      let oldMsgId = msg.id
      msg.id = argsHash
      msg.fromBlockchain = true
      yield put({ type: 'UPDATE_MESSAGE', id: oldMsgId, payload: msg })
      console.log(argsHash)

      txComplete = txHash && state.transactions[txHash].status === 'success'
    } else if (error) {
      console.log('ERROR')
    }
  }

  console.log('4 - AFTER')
}

// register sagas
function* messagesSaga() {
  yield takeLatest('MESSAGE_REQUESTED_S', handleTransaction)
  yield takeLatest('MESSAGE_REQUESTED', createMessage)
  yield takeLatest('MESSAGE_COUNT_REQUESTED', gotMessageCount)
  yield takeLatest('MESSAGE_FETCH_REQUESTED', gotMessage)
  yield takeLatest('MESSAGE_TX_REQUESTED', successMessageTx)
  yield takeLatest('COMMENT_TX_REQUESTED', successCommentTx)
  yield takeLatest('COMMENT_REQUESTED', createComment)
}

export default messagesSaga
