import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { DrizzleProvider } from 'drizzle-react'

// Utils
import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers.js'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Newsfeed from './messages/layouts/Newsfeed'
import UserSignup from './user/layouts/UserSignup'
import UserUpdate from './user/layouts/UserUpdate'
import UserPageContainer from './user/components/userpage/UserPageContainer'
import LoadingContainer from './util/loading/LoadingContainer'

// Configs
import store from './store'
import drizzleOptions from './drizzleOptions'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

//<Route path="/" component={App}>
//  <IndexRoute component={Home} />
//  <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
//  <Route path="newsfeed" component={UserIsAuthenticated(Newsfeed)} />
//  <Route path="signup" component={UserIsNotAuthenticated(SignUp)} />
//  <Route path="profile" component={UserIsAuthenticated(Profile)} />
//  <Route path="user/:id" component={UserIsAuthenticated(UserPageContainer)} />
//</Route>

ReactDOM.render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <Provider store={store}>
      <LoadingContainer>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="newsfeed" component={UserIsAuthenticated(Newsfeed)} />
            <Route path="signup" component={UserIsNotAuthenticated(UserSignup)} />
            <Route path="profile" component={UserIsAuthenticated(UserUpdate)} />
            <Route path="user/:id" component={UserIsAuthenticated(UserPageContainer)} />
          </Route>
        </Router>
      </LoadingContainer>
    </Provider>
  </DrizzleProvider>,
  document.getElementById('root')
)
