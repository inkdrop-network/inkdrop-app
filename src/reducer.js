import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import userReducer from './user/userReducer'
import messagesReducer from './messages/messagesReducer'

const reducer = combineReducers({
	routing: routerReducer,
	user: userReducer,
	messages: messagesReducer,
	...drizzleReducers,
})

export default reducer
