import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroller'
import MessageItemContainer from '../messageitem/MessageItemContainer'
import loadingSpinner from '../../../icons/loading-spinner.svg'

class MessageList extends PureComponent {
  constructor(props) {
    super(props)

    this.loadMore = this.loadMore.bind(this)
  }

  loadMore() {
    this.props.fetchMessages(this.props.pagination.items)
  }

  render() {
    const loader = (
      <div className="text-center" key={-1}>
        <img src={loadingSpinner} alt="loading" width="20" height="20" />
      </div>
    )

    return (
      <InfiniteScroll
        pageStart={0}
        threshold={1}
        loadMore={this.loadMore}
        hasMore={this.props.pagination.hasMore}
        loader={loader}>
        <div id="messages">
          {this.props.messages.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
        </div>
      </InfiniteScroll>
    )
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  pagination: PropTypes.object,
}

export default MessageList
