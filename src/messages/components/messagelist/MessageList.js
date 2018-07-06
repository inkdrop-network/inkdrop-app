import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MessageItemContainer from '../messageitem/MessageItemContainer'
import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class MessageList extends PureComponent {
  constructor(props) {
    super(props)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false)

    this.props.fetchMessages(this.props.pagination.items)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll() {
    // Taken from: http://blog.sodhanalibrary.com/2016/08/detect-when-user-scrolls-to-bottom-of.html#.Wz93G9gzbOQ
    const windowHeight =
      'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    )
    // TODO: trigger the reload 100px before the windowBottom
    const windowBottom = windowHeight + window.pageYOffset
    if (windowBottom >= docHeight && !this.props.pagination.isLoading) {
      // console.log('bottom reached')
      this.props.fetchMessages(this.props.pagination.items)
    }
  }

  render() {
    return (
      <div id="messages" className="">
        {this.props.messages.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
        {this.props.pagination.isLoading && (
          <div class="text-center">
            <img src={loadingSpinner} alt="loading" width="20" height="20" />
          </div>
        )}
      </div>
    )
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  initialized: PropTypes.bool,
  pagination: PropTypes.object,
}

export default MessageList
