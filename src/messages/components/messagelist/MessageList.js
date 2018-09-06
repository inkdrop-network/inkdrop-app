import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroller'
import FlipMove from 'react-flip-move'
// import MasonryInfiniteScroller from 'react-masonry-infinite'
// import Masonry from 'react-masonry-component'

import MessageItemContainer from '../messageitem/MessageItemContainer'
import loadingSpinner from '../../../../public/icons/loading-spinner.svg'

class MessageList extends PureComponent {
  constructor(props) {
    super(props)

    this.masonryOptions = {
      itemSelector: '.grid-item', // use a separate class for itemSelector, other than .col-
      columnWidth: '.grid-sizer',
      percentPosition: true,
    }

    this.loadMore = this.loadMore.bind(this)
    this.sortNewsfeed = this.sortNewsfeed.bind(this)
  }

  loadMore() {
    this.props.fetchMessages(this.props.pagination.items)
  }

  // componentDidMount() {
  //   this.props.fetchMessages(this.props.pagination.items)
  // }

  sortNewsfeed() {
    this.props.sortNewsfeed()
  }

  render() {
    const loader = (
      <div className="text-center" key={-1}>
        <img src={loadingSpinner} alt="loading" width="20" height="20" />
      </div>
    )

    // let items = this.props.messages
    // sort messages descending according to their drops
    let items = this.props.messages.sort(function(msgA, msgB) {
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
        <FlipMove
          disableAllAnimations={false} //this.props.messages.length <= 0}
          appearAnimation="none"
          enterAnimation="none"
          leaveAnimation="none"
          duration={0}
          staggerDurationBy={0}>
          {items.map(msg => <MessageItemContainer message={msg} key={msg.id} />)}
        </FlipMove>
      </InfiniteScroll>
    )
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  pagination: PropTypes.object,
  fetchMessages: PropTypes.func,
  sortNewsfeed: PropTypes.func,
}

export default MessageList
