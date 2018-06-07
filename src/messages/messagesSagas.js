import { put, takeLatest } from 'redux-saga/effects'

const MESSAGE_POSTED = 'MESSAGE_POSTED'
function messagePosted(content) {
  return {
    type: MESSAGE_POSTED,
    payload: content,
  }
}

function* createMessage(action) {
  yield put(messagePosted(action.payload))
}

const MESSAGE_COUNT_GOT = 'MESSAGE_COUNT_GOT'
function messageCountGot(count) {
  return {
    type: MESSAGE_COUNT_GOT,
    payload: count,
  }
}

function* gotMessageCount(action) {
  yield put(messageCountGot(action.payload))
}

const MESSAGE_GOT = 'MESSAGE_GOT'
function messageGot(message) {
  return {
    type: MESSAGE_GOT,
    payload: message,
  }
}

function* gotMessage(action) {
  yield put(messageGot(action.payload))
}

const MESSAGE_TX_SUCCESS = 'MESSAGE_TX_SUCCESS'
function messageSuccess(message) {
  return {
    type: MESSAGE_TX_SUCCESS,
    payload: message,
  }
}

function* successMessageTx(action) {
  yield put(messageSuccess(action.payload))
}

function* messagesSaga() {
  yield takeLatest('MESSAGE_REQUESTED', createMessage)
  yield takeLatest('MESSAGE_COUNT_REQUESTED', gotMessageCount)
  yield takeLatest('MESSAGE_FETCH_REQUESTED', gotMessage)
  yield takeLatest('MESSAGE_TX_REQUESTED', successMessageTx)
}

export default messagesSaga
