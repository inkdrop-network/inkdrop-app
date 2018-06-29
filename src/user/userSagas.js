import { put, takeLatest } from 'redux-saga/effects'
import { USER_LOGGED_IN, USER_LOGGED_OUT, USER_UPDATED } from './userReducer'

// saga actions actions
const LOGIN_REQUESTED = 'LOGIN_REQUESTED'
const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED'
const SIGNUP_REQUESTED = 'SIGNUP_REQUESTED'
const USERUPDATE_REQUESTED = 'USERUPDATE_REQUESTED'

// sagas
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

// register sagas
function* userSagas() {
  yield takeLatest(LOGIN_REQUESTED, logUserIn)
  yield takeLatest(LOGOUT_REQUESTED, logUserOut)
  yield takeLatest(SIGNUP_REQUESTED, signUserUp)
  yield takeLatest(USERUPDATE_REQUESTED, updateUser)
}

export default userSagas
