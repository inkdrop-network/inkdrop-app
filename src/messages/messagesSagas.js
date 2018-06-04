import { put } from 'redux-saga/effects'

export const MESSAGE_POSTED = 'MESSAGE_POSTED'
function messagePosted(content) {
	return {
		type: MESSAGE_POSTED,
		payload: content,
	}
}

export function* createMessage(action) {
	yield put(messagePosted(action.payload))
}
