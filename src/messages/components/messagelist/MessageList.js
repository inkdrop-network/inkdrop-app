import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import FlipMove from 'react-flip-move'
import InfiniteScroll from 'react-infinite-scroller'
import MessageItemContainer from '../messageitem/MessageItemContainer'
import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

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

    let items = []
    items = this.props.messages.sort(function(msgA, msgB) {
      return msgB.drops - msgA.drops
    })

    // TODO: Show loader in the beginning and enable FlipMove only once the first posts are fetched and the array is sorted
    return (
      <InfiniteScroll
        pageStart={0}
        threshold={1}
        initialLoad={true}
        loadMore={this.loadMore}
        hasMore={this.props.pagination.hasMore}
        loader={loader}>
        <div id="messages">
          <FlipMove
            disableAllAnimations={false} //this.props.messages.length <= 0}
            appearAnimation="none"
            enterAnimation="none"
            leaveAnimation="none"
            duration={750}
            staggerDurationBy={30}>
            {items.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
          </FlipMove>
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
