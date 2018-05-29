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
import HomeContainerOld from './layouts/old_home/HomeContainer'
import Dashboard from './layouts/dashboard/Dashboard'
import Newsfeed from './layouts/newsfeed/Newsfeed'
import SignUp from './user/layouts/signup/SignUp'
import Profile from './user/layouts/profile/Profile'
import UserPageContainer from './messages/ui/userpage/UserPageContainer'
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
  <DrizzleProvider options={drizzleOptions}>
    <Provider store={store}>
      <LoadingContainer>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="signup" component={UserIsNotAuthenticated(SignUp)} />
            <Route path="newsfeed" component={UserIsAuthenticated(Newsfeed)} />
          </Route>
        </Router>
      </LoadingContainer>
    </Provider>
  </DrizzleProvider>,
  document.getElementById('root')
)
