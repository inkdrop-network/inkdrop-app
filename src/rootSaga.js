import { all, fork, takeLatest } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import { logUserIn, logUserOut, signUserUp, updateUser } from './user/userSagas'
import { createMessage } from './messages/messagesSagas'

export default function* rootSaga() {
	yield all(drizzleSagas.map(saga => fork(saga)))
	yield takeLatest('LOGIN_REQUESTED', logUserIn)
	yield takeLatest('LOGOUT_REQUESTED', logUserOut)
	yield takeLatest('SIGNUP_REQUESTED', signUserUp)
	yield takeLatest('USERUPDATE_REQUESTED', updateUser)
	yield takeLatest('MESSAGE_REQUESTED', createMessage)
}
