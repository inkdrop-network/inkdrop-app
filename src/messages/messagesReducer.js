import { USER_LOGGED_OUT } from '../user/userReducer'
const initialState = {
  data: [],
  total: 0,
  userpage_user: null,
  userpage_messages: [],
  pagination: {
    items: 0,
    hasMore: true,
  },
}

// actions
export const MESSAGE_GOT = 'MESSAGE_GOT'
export const MESSAGES_GOT = 'MESSAGES_GOT'
export const USER_MESSAGE_GOT = 'USER_MESSAGE_GOT'
export const USER_PAGE_GOT = 'USER_PAGE_GOT'

export const MESSAGE_POSTED = 'MESSAGE_POSTED'
export const COMMENT_POSTED = 'COMMENT_POSTED'

export const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const UPDATE_MESSAGE_COMMENTS = 'UPDATE_MESSAGE_COMMENTS'
export const UPDATE_USER_MESSAGE_COMMENTS = 'UPDATE_USER_MESSAGE_COMMENTS'
export const USER_MESSAGE_UPDATE = 'USER_MESSAGE_UPDATE'

export const USER_MESSAGE_RESET = 'USER_MESSAGE_RESET'

export const DELETE_MESSAGE = 'DELETE_MESSAGE'
export const DELETE_COMMENT = 'DELETE_COMMENT'

export const MESSAGES_SORTED = 'MESSAGES_SORTED'

export const MESSAGES_PAGINATION = 'MESSAGES_PAGINATION'

// reducer
const messagesReducer = (state = initialState, action) => {
  if (action.type === USER_LOGGED_OUT) {
    return Object.assign({}, state, initialState)
  }

  if (action.type === MESSAGES_GOT) {
    return Object.assign({}, state, {
      total: action.payload,
    })
  }

  if (action.type === MESSAGE_GOT) {
    return Object.assign({}, state, {
      data: state.data.concat(action.payload),
    })
  }

  if (action.type === MESSAGES_PAGINATION) {
    return Object.assign({}, state, {
      pagination: action.payload,
    })
  }

  if (action.type === MESSAGES_SORTED) {
    return Object.assign({}, state, {
      data: state.data.sort(function(msgA, msgB) {
        return msgB.drops - msgA.drops
      }),
    })
  }

  if (action.type === DELETE_MESSAGE) {
    return Object.assign({}, state, {
      data: state.data.filter(msg => msg.id !== action.payload.id),
    })
  }

  if (action.type === MESSAGE_POSTED) {
    return Object.assign({}, state, {
      data: [action.payload].concat(state.data),
    })
  }

  if (action.type === UPDATE_MESSAGE) {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload }
        }
        return item
      }),
    })
  }

  if (action.type === UPDATE_MESSAGE_COMMENTS) {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            comments: item.comments.concat(action.payload),
          }
        }
        return item
      }),
    })
  }

  if (action.type === COMMENT_POSTED) {
    return Object.assign({}, state, {
      data: state.data.map((item, index) => {
        if (item.id === action.payload.parent) {
          return {
            ...item,
            comments: [...item.comments, action.payload],
          }
        }

        return item
      }),
    })
  }

  if (action.type === UPDATE_COMMENT) {
    return Object.assign({}, state, {
      data: state.data.map(item => {
        if (item.id === action.payload.parent) {
          return {
            ...item,
            comments: item.comments.map(comment => {
              if (comment.id === action.payload.id) {
                return {
                  ...comment,
                  ...action.payload,
                }
              }
              return comment
            }),
          }
        }

        return item
      }),
    })
  }

  if (action.type === USER_PAGE_GOT) {
    return Object.assign({}, state, {
      userpage_user: action.payload,
    })
  }

  if (action.type === USER_MESSAGE_GOT) {
    return Object.assign({}, state, {
      userpage_messages: state.userpage_messages.concat(action.payload),
    })
  }

  if (action.type === USER_MESSAGE_UPDATE) {
    return Object.assign({}, state, {
      userpage_messages: state.userpage_messages.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload }
        }
        return item
      }),
    })
  }

  if (action.type === USER_MESSAGE_RESET) {
    return Object.assign({}, state, {
      userpage_user: null,
      userpage_messages: [],
    })
  }

  if (action.type === UPDATE_USER_MESSAGE_COMMENTS) {
    return Object.assign({}, state, {
      userpage_messages: state.userpage_messages.map(item => {
        if (item.id === action.id) {
          return {
            ...item,
            comments: item.comments.concat(action.payload),
          }
        }
        return item
      }),
    })
  }

  return state
}

export default messagesReducer
