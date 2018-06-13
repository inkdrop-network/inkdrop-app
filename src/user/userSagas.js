import { put, takeLatest } from 'redux-saga/effects'

// actions
const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
const USER_UPDATED = 'USER_UPDATED'
const USER_DROPPED = 'USER_DROPPED'

//sagas
function* logUserIn(action) {
  yield put({
    type: USER_LOGGED_IN,
    payload: action.payload,
  })
}

function* signUserUp(action) {
  yield put({
    type: USER_LOGGED_IN,
    payload: action.payload,
  })
}

function* logUserOut(action) {
  yield put({
    type: USER_LOGGED_OUT,
    payload: action.payload,
  })
}

function* updateUser(action) {
  yield put({
    type: USER_UPDATED,
    payload: action.payload,
  })
}

function* dropFromUser(action) {
  yield put({
    type: USER_DROPPED,
    payload: action.payload,
  })
}

// register sagas
function* userSagas() {
  yield takeLatest('LOGIN_REQUESTED', logUserIn)
  yield takeLatest('LOGOUT_REQUESTED', logUserOut)
  yield takeLatest('SIGNUP_REQUESTED', signUserUp)
  yield takeLatest('USERUPDATE_REQUESTED', updateUser)
  yield takeLatest('MESSAGE_DROP_REQUESTED', dropFromUser)
}

export default userSagas
