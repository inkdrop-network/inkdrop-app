import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import messagesReducer from './messages/messagesReducer'
import web3Reducer from './util/web3/web3Reducer'

const reducer = combineReducers({
  routing: routerReducer,
  web3: web3Reducer,
  user: userReducer,
  messages: messagesReducer,
})

export default reducer
