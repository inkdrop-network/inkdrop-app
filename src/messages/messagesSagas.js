import { put, takeLatest, takeEvery } from 'redux-saga/effects'

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

function* messagesSaga() {
	yield takeLatest('MESSAGE_REQUESTED', createMessage)
	yield takeLatest('MESSAGE_COUNT_REQUESTED', gotMessageCount)
	yield takeEvery('MESSAGE_FETCH_REQUESTED', gotMessage)
}

export default messagesSaga
