import { put, takeLatest } from 'redux-saga/effects'

const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user,
  }
}

function* logUserIn(action) {
  yield put(userLoggedIn(action.payload))
}

function* signUserUp(action) {
  yield put(userLoggedIn(action.payload))
}

const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
function userLoggedOut(user) {
  return {
    type: USER_LOGGED_OUT,
    payload: user,
  }
}

function* logUserOut(action) {
  yield put(userLoggedOut(action.payload))
}

const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user,
  }
}

function* updateUser(action) {
  yield put(userUpdated(action.payload))
}

function* userSagas() {
  yield takeLatest('LOGIN_REQUESTED', logUserIn)
  yield takeLatest('LOGOUT_REQUESTED', logUserOut)
  yield takeLatest('SIGNUP_REQUESTED', signUserUp)
  yield takeLatest('USERUPDATE_REQUESTED', updateUser)
}

export default userSagas
