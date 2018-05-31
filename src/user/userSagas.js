import { put } from 'redux-saga/effects'

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
	return {
		type: USER_LOGGED_IN,
		payload: user,
	}
}

export function* logUserIn(action) {
	yield put(userLoggedIn(action.payload))
}

export function* signUserUp(action) {
	yield put(userLoggedIn(action.payload))
}

export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
function userLoggedOut(user) {
	return {
		type: USER_LOGGED_OUT,
		payload: user,
	}
}

export function* logUserOut(action) {
	yield put(userLoggedOut(action.payload))
}

export const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
	return {
		type: USER_UPDATED,
		payload: user,
	}
}

export function* updateUser(action) {
	yield put(userUpdated(action.payload))
}
