import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
// import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducer from './reducer'
import rootSaga from './rootSaga'
import createSagaMiddleware from 'redux-saga'
import { Drizzle, generateContractsInitialState } from 'drizzle'
import drizzleOptions from './drizzleOptions'

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const routingMiddleware = routerMiddleware(browserHistory)
const sagaMiddleware = createSagaMiddleware()

const initialState = {
	contracts: generateContractsInitialState(drizzleOptions),
}

const store = createStore(
	reducer,
	initialState,
	// composeEnhancers(applyMiddleware(thunkMiddleware, routingMiddleware, sagaMiddleware))
	composeEnhancers(applyMiddleware(sagaMiddleware, routingMiddleware))
)

// NEW line here
const drizzle = new Drizzle(drizzleOptions, store)

sagaMiddleware.run(rootSaga)
// NEW line here
sagaMiddleware.setContext({
	drizzle,
})

export { store, drizzle }
