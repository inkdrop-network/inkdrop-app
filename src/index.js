import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
// import { DrizzleProvider } from 'drizzle-react'
import ReactGA from 'react-ga'

// utils
import { UserIsAuthenticated, UserIsNotAuthenticated } from './utils/wrappers.js'
import CustomDrizzleProvider from './utils/drizzle/CustomDrizzleProvider'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Newsfeed from './messages/layouts/Newsfeed'
import UserSignup from './user/layouts/UserSignup'
import UserUpdate from './user/layouts/UserUpdate'
import UserPageContainer from './messages/components/userpage/UserPageContainer'
import LoadingContainer from './utils/loading/LoadingContainer'

// Configs
import { store, drizzle } from './store'
import drizzleOptions from './drizzleOptions'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_ID)

function logPageView() {
  // add this function to your component. See: https://stackoverflow.com/a/44247005
  // ReactGA.set({ page: window.location.pathname + window.location.search })
  ReactGA.pageview(window.location.pathname + window.location.search)
}

ReactDOM.render(
  <CustomDrizzleProvider drizzle={drizzle} options={drizzleOptions} store={store}>
    <Provider store={store}>
      <LoadingContainer>
        <Router history={history} onUpdate={logPageView}>
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
  </CustomDrizzleProvider>,
  document.getElementById('root')
)
