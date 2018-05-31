import { all, fork, takeEvery } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import { logUserIn, logUserOut, signUserUp, updateUser } from './user/userSagas'

export default function* rootSaga() {
	yield all(drizzleSagas.map(saga => fork(saga)))
	yield takeEvery('LOGIN_REQUESTED', logUserIn)
	yield takeEvery('LOGOUT_REQUESTED', logUserOut)
	yield takeEvery('SIGNUP_REQUESTED', signUserUp)
	yield takeEvery('USERUPDATE_REQUESTED', updateUser)
}
