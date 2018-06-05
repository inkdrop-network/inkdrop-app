import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from 'drizzle'
import userSagas from './user/userSagas'
import messagesSagas from './messages/messagesSagas'

export default function* rootSaga() {
	let sagas = drizzleSagas.map(saga => fork(saga)).concat([fork(messagesSagas), fork(userSagas)])
	yield all(sagas)
}
