import { put, takeLatest } from 'redux-saga/effects'

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

// register sagas
function* messagesSaga() {
  yield takeLatest('MESSAGE_REQUESTED', createMessage)
  yield takeLatest('MESSAGE_COUNT_REQUESTED', gotMessageCount)
  yield takeLatest('MESSAGE_FETCH_REQUESTED', gotMessage)
  yield takeLatest('MESSAGE_TX_REQUESTED', successMessageTx)
  yield takeLatest('COMMENT_TX_REQUESTED', successCommentTx)
  yield takeLatest('COMMENT_REQUESTED', createComment)
}

export default messagesSaga
